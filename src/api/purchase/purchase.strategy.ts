import { Purchase, PurchaseItem } from '../models/entity';
import {
  CreatePurchaseDto,
  UpdatePurchaseDto,
} from '../models/DTO/request/purchaseRequestDTO';
import { PurchaseResponseDTO } from '../models/DTO/response/purchaseResponseDTO';
import { IPurchaseRepository } from './purchase.repository';
import { IIngredientService } from '../ingredient/ingredient.service';
import { IPurchaseValidator } from './purchase.validator';
import { IPurchaseItemFactory } from './purchase.item.factory';
import { IStockMovementHandler } from './stock.movement.handler';

export interface IPurchaseStrategy {
  execute(
    dto: CreatePurchaseDto | UpdatePurchaseDto,
    id?: number,
  ): Promise<PurchaseResponseDTO>;
}

// Common dependencies for strategies
export abstract class BasePurchaseStrategy implements IPurchaseStrategy {
  constructor(
    protected readonly _repository: IPurchaseRepository,
    protected readonly _ingredientService: IIngredientService,
    protected readonly _validator: IPurchaseValidator,
    protected readonly _itemFactory: IPurchaseItemFactory,
    protected readonly _stockHandler: IStockMovementHandler,
  ) {}

  protected async loadCommonData() {
    const units = await this._ingredientService.getAllUnits();
    if (!units) {
      throw new Error('Failed to load units');
    }
    const ingredients = await this._ingredientService.searchIngredients(
      '',
      1,
      1000,
    );
    if (!ingredients) {
      throw new Error('Failed to load ingredients');
    }
    return { units, ingredients };
  }

  abstract execute(
    dto: CreatePurchaseDto | UpdatePurchaseDto,
    id?: number,
  ): Promise<PurchaseResponseDTO>;
}

export class CreatePurchaseStrategy extends BasePurchaseStrategy {
  async execute(dto: CreatePurchaseDto): Promise<PurchaseResponseDTO> {
    const { units, ingredients } = await this.loadCommonData();

    const purchase = new Purchase();
    purchase.providerId = dto.providerId;

    const purchaseItems: PurchaseItem[] = [];
    for (const itemDto of dto.purchaseItems) {
      const item = this._itemFactory.createPurchaseItem(
        itemDto,
        units,
        ingredients,
        purchase,
      );
      await this._stockHandler.handleStockMovementForPurchaseItem(item);
      purchaseItems.push(item);
    }
    console.log('Created Items: (purchase.strategy line 86)', purchaseItems);
    purchase.purchaseItems = purchaseItems;

    return await this._repository.create(purchase);
  }
}

export class UpdatePurchaseStrategy extends BasePurchaseStrategy {
  async execute(
    dto: UpdatePurchaseDto,
    id: number,
  ): Promise<PurchaseResponseDTO> {
    if (!dto.providerId) {
      throw new Error('providerId is required');
    }
    if (!dto.purchaseItems || dto.purchaseItems.length === 0) {
      throw new Error('Purchase must have at least one item');
    }
    const { units, ingredients } = await this.loadCommonData();

    const existingItems = await this._repository.findItemsByPurchaseId(id);
    const purchaseEntity = new Purchase();
    purchaseEntity.id = id;
    purchaseEntity.providerId = dto.providerId;

    const updatedItems: PurchaseItem[] = [];
    for (const itemDto of dto.purchaseItems) {
      const existingItem = existingItems.find(
        (pi) => pi.ingredientId === itemDto.ingredientId,
      );
      const newItem = existingItem || new PurchaseItem();
      const previousQuantity = newItem.unitQuantity || 0;
      const existingId = existingItem?.id;

      Object.assign(
        newItem,
        this._itemFactory.createPurchaseItem(
          itemDto,
          units,
          ingredients,
          purchaseEntity,
        ),
      );
      if (existingId) {
        newItem.id = existingId;
      }
      await this._stockHandler.handleStockMovementForPurchaseItem(
        newItem,
        true,
        previousQuantity,
      );
      updatedItems.push(newItem);
    }
    purchaseEntity.purchaseItems = updatedItems;
    console.log('Updated Items: (purchase.strategy line 115)', updatedItems);
    console.log(
      'Purchase to Update: (purchase.strategy line 116)',
      purchaseEntity,
    );
    const result = await this._repository.update(id, purchaseEntity);
    if (!result) {
      throw new Error(`Purchase with id ${id} not found`);
    }
    return result;
  }
}
