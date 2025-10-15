import {
  CreatePurchaseDto,
  UpdatePurchaseDto,
} from '../models/DTO/request/purchaseRequestDTO';
import { PurchaseResponseDTO } from '../models/DTO/response/purchaseResponseDTO';
import { PurchasePageResponseDTO } from '../models/DTO/response/purchasePageResponseDTO';
import { PurchaseItem } from '../models/entity';
import { IPurchaseRepository } from './purchase.repository';
import { IPurchaseService } from './purchase.service';
import { HttpError } from '../../errors/httpError';
import logger from '../../config/logger';
import {
  CreatePurchaseStrategy,
  UpdatePurchaseStrategy,
} from './purchase.strategy';

export class PurchaseService implements IPurchaseService {
  constructor(
    private readonly _purchaseRepository: IPurchaseRepository,
    private readonly _createStrategy: CreatePurchaseStrategy,
    private readonly _updateStrategy: UpdatePurchaseStrategy,
  ) {}

  async findItemsByPurchaseId(purchaseId: number): Promise<PurchaseItem[]> {
    return await this._purchaseRepository.findItemsByPurchaseId(purchaseId);
  }

  async createPurchase(
    purchaseDto: CreatePurchaseDto,
  ): Promise<PurchaseResponseDTO> {
    try {
      // Strategy Pattern: Delegates to specific strategy for creation
      // Open-Closed: New strategies can be added without modifying this method
      return await this._createStrategy.execute(purchaseDto);
    } catch (error: any) {
      logger.error('Error creating purchase with items', {
        error: error.message,
        stack: error.stack,
      });
      throw new HttpError(500, 'Failed to create purchase');
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
    try {
      // Strategy Pattern: Delegates to specific strategy for update
      // Open-Closed: New strategies can be added without modifying this method
      return await this._updateStrategy.execute(purchaseDto, id);
    } catch (error: any) {
      logger.error('Error updating purchase', {
        id,
        error: error.message,
        stack: error.stack,
      });
      throw new HttpError(500, 'Failed to update purchase');
    }
  }

  async deletePurchase(id: number): Promise<PurchaseResponseDTO | void> {
    return await this._purchaseRepository.delete(id);
  }
}
