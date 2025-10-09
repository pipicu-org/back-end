import { DataSource } from 'typeorm';
import {
  CreatePurchaseDto,
  UpdatePurchaseDto,
} from '../models/DTO/request/purchaseRequestDTO';
import { PurchaseResponseDTO } from '../models/DTO/response/purchaseResponseDTO';
import { PurchasePageResponseDTO } from '../models/DTO/response/purchasePageResponseDTO';
import { Purchase, PurchaseItem, Ingredient, Unit } from '../models/entity';
import { PurchaseMapper } from '../models/mappers/purchaseMapper';
import { IPurchaseRepository } from './purchase.repository';
import { IPurchaseService } from './purchase.service';
import { IStockMovementService } from '../stockMovement/stockMovement.service';
import { StockMovementRequestDTO } from '../models/DTO/request/stockMovementRequestDTO';
import { HttpError } from '../../errors/httpError';
import logger from '../../config/logger';

export class PurchaseService implements IPurchaseService {
  constructor(
    private readonly _purchaseRepository: IPurchaseRepository,
    private readonly _purchaseMapper: PurchaseMapper,
    private readonly _dataSource: DataSource,
    private readonly _stockMovementService: IStockMovementService,
  ) {}

  async createPurchase(
    purchaseDto: CreatePurchaseDto,
  ): Promise<PurchaseResponseDTO> {
    const queryRunner = this._dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const purchase = new Purchase();
      purchase.providerId = purchaseDto.providerId;

      const units = await queryRunner.manager.find(Unit);

      const purchaseItems: PurchaseItem[] = [];
      for (const itemDto of purchaseDto.purchaseItems) {
        const unit = units.find((u) => u.id === itemDto.unitId);
        if (!unit) {
          throw new HttpError(400, `Unit with id ${itemDto.unitId} not found`);
        }
        const item = new PurchaseItem();
        item.ingredientId = itemDto.ingredientId;
        item.cost = itemDto.cost;
        item.quantity = itemDto.quantity;
        item.unitId = itemDto.unitId;
        item.unitQuantity = itemDto.quantity * unit.factor;

        // Load ingredient for stock update
        const ingredient = await queryRunner.manager.findOne(Ingredient, {
          where: { id: itemDto.ingredientId },
        });
        if (!ingredient) {
          throw new HttpError(
            400,
            `Ingredient with id ${itemDto.ingredientId} not found`,
          );
        }

        // Create StockMovement via service
        const stockMovementRequest = new StockMovementRequestDTO();
        stockMovementRequest.ingredientId = item.ingredientId;
        stockMovementRequest.quantity = item.unitQuantity;
        stockMovementRequest.unitId = item.unitId;
        stockMovementRequest.stockMovementTypeId = 1; // "Buy" for purchases
        stockMovementRequest.purchaseItemId = undefined; // will be set after save
        const stockMovement =
          await this._stockMovementService.createStockMovement(
            stockMovementRequest,
          );
        if (stockMovement) {
          item.stockMovements = [stockMovement];
        }

        purchaseItems.push(item);
      }

      purchase.purchaseItems = purchaseItems;

      const savedPurchase = await queryRunner.manager.save(Purchase, purchase);

      await queryRunner.commitTransaction();
      return this._purchaseMapper.toResponseDTO(savedPurchase);
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      logger.error('Error creating purchase with items', {
        error: error.message,
        stack: error.stack,
      });
      throw new HttpError(500, 'Failed to create purchase');
    } finally {
      await queryRunner.release();
    }
  }

  async getAllPurchases(
    page: number = 0,
    size: number = 10,
    sort: string = 'date_desc',
  ): Promise<PurchasePageResponseDTO> {
    // Validate parameters
    if (page < 0) {
      throw new HttpError(400, 'Page must be >= 0');
    }
    if (size < 1 || size > 100) {
      throw new HttpError(400, 'Size must be between 1 and 100');
    }

    // Parse sort parameter
    const [sortField, sortOrderStr] = sort.split('_');
    let sortOrder: 'ASC' | 'DESC' = 'DESC';
    if (sortOrderStr && sortOrderStr.toLowerCase() === 'asc') {
      sortOrder = 'ASC';
    }

    if (sortField !== 'date') {
      throw new HttpError(400, 'Sort field must be "date"');
    }

    return await this._purchaseRepository.findAllPaginated(
      page,
      size,
      sortField,
      sortOrder,
    );
  }

  async getPurchaseById(id: number): Promise<PurchaseResponseDTO | void> {
    return await this._purchaseRepository.findById(id);
  }

  async updatePurchase(
    id: number,
    purchaseDto: UpdatePurchaseDto,
  ): Promise<PurchaseResponseDTO | void> {
    const purchase = new Purchase();
    if (purchaseDto.providerId !== undefined) {
      purchase.providerId = purchaseDto.providerId;
    }
    return await this._purchaseRepository.update(id, purchase);
  }

  async deletePurchase(id: number): Promise<PurchaseResponseDTO | void> {
    return await this._purchaseRepository.delete(id);
  }
}
