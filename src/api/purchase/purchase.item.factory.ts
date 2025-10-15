import { PurchaseItem } from '../models/entity';
import { CreatePurchaseItemDto } from '../models/DTO/request/purchaseRequestDTO';
import { Unit } from '../models/entity/unit';
import { IngredientSearchResponseDTO } from '../models/DTO/response/ingredientSearchResponseDTO';
import { IPurchaseValidator } from './purchase.validator';

import { Purchase } from '../models/entity/purchase';

// Factory Pattern: Encapsulates object creation logic
export interface IPurchaseItemFactory {
  createPurchaseItem(
    itemDto: CreatePurchaseItemDto,
    units: Unit[],
    ingredients: IngredientSearchResponseDTO,
    purchase: Purchase,
  ): PurchaseItem;
}

export class PurchaseItemFactory implements IPurchaseItemFactory {
  constructor(private readonly _validator: IPurchaseValidator) {}

  // Single Responsibility: Only creates purchase items
  createPurchaseItem(
    itemDto: CreatePurchaseItemDto,
    units: Unit[],
    ingredients: IngredientSearchResponseDTO,
    purchase: Purchase,
  ): PurchaseItem {
    // Validate unit and ingredient
    const unit = this._validator.validateUnit(itemDto.unitId, units);
    this._validator.validateIngredient(itemDto.ingredientId, ingredients);

    const item = new PurchaseItem();
    item.ingredientId = itemDto.ingredientId;
    item.cost = itemDto.cost;
    item.quantity = itemDto.quantity;
    item.unitId = itemDto.unitId;
    item.unitQuantity = itemDto.quantity * unit.factor;
    item.purchase = purchase;
    item.purchaseId = purchase.id;
    console.log('Created Item: (purchaseItemFactory line 39)', item);
    return item;
  }
}
