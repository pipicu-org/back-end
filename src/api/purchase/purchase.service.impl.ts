import { DataSource } from 'typeorm';
import { CreatePurchaseDto, UpdatePurchaseDto } from '../models/DTO/request/purchaseRequestDTO';
import { PurchaseResponseDTO } from '../models/DTO/response/purchaseResponseDTO';
import { Purchase, PurchaseItem } from '../models/entity';
import { PurchaseMapper } from '../models/mappers/purchaseMapper';
import { IPurchaseRepository } from './purchase.repository';
import { IPurchaseService } from './purchase.service';
import { HttpError } from '../../errors/httpError';
import logger from '../../config/logger';

export class PurchaseService implements IPurchaseService {
  constructor(
    private readonly _purchaseRepository: IPurchaseRepository,
    private readonly _purchaseMapper: PurchaseMapper,
    private readonly _dataSource: DataSource,
  ) {}

  async createPurchase(purchaseDto: CreatePurchaseDto): Promise<PurchaseResponseDTO> {
    const queryRunner = this._dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const purchase = new Purchase();
      purchase.providerId = purchaseDto.providerId;

      const savedPurchase = await queryRunner.manager.save(Purchase, purchase);

      const purchaseItems: PurchaseItem[] = [];
      for (const itemDto of purchaseDto.purchaseItems) {
        const item = new PurchaseItem();
        item.purchaseId = savedPurchase.id;
        item.ingredientId = itemDto.ingredientId;
        item.cost = itemDto.cost;
        item.quantity = itemDto.quantity;
        item.unitId = itemDto.unitId;
        item.unitQuantity = itemDto.unitQuantity;
        purchaseItems.push(item);
      }

      await queryRunner.manager.save(PurchaseItem, purchaseItems);
      savedPurchase.purchaseItems = purchaseItems;

      await queryRunner.commitTransaction();
      return this._purchaseMapper.toResponseDTO(savedPurchase);
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      logger.error('Error creating purchase with items', { error: error.message, stack: error.stack });
      throw new HttpError(500, 'Failed to create purchase');
    } finally {
      await queryRunner.release();
    }
  }

  async getAllPurchases(): Promise<PurchaseResponseDTO[]> {
    return await this._purchaseRepository.findAll();
  }

  async getPurchaseById(id: number): Promise<PurchaseResponseDTO | void> {
    return await this._purchaseRepository.findById(id);
  }

  async updatePurchase(id: number, purchaseDto: UpdatePurchaseDto): Promise<PurchaseResponseDTO | void> {
    const purchase = new Purchase();
    if (purchaseDto.providerId !== undefined) {
      purchase.providerId = purchaseDto.providerId;
    }
    // Note: Updating purchase items would require more complex logic, omitted for simplicity
    return await this._purchaseRepository.update(id, purchase);
  }

  async deletePurchase(id: number): Promise<PurchaseResponseDTO | void> {
    return await this._purchaseRepository.delete(id);
  }
}