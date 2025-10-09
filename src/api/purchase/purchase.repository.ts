import { Repository } from 'typeorm';
import { Purchase } from '../models/entity';
import { PurchaseResponseDTO } from '../models/DTO/response/purchaseResponseDTO';
import { PurchasePageResponseDTO } from '../models/DTO/response/purchasePageResponseDTO';
import { PurchaseMapper } from '../models/mappers/purchaseMapper';
import { HttpError } from '../../errors/httpError';
import logger from '../../config/logger';

export interface IPurchaseRepository {
  findAllPaginated(
    page: number,
    size: number,
    sortField: string,
    sortOrder: 'ASC' | 'DESC',
  ): Promise<PurchasePageResponseDTO>;
  findById(id: number): Promise<PurchaseResponseDTO | void>;
  create(purchase: Purchase): Promise<PurchaseResponseDTO>;
  update(id: number, purchase: Purchase): Promise<PurchaseResponseDTO | void>;
  delete(id: number): Promise<PurchaseResponseDTO | void>;
}

export class PurchaseRepository implements IPurchaseRepository {
  constructor(
    private readonly _dbPurchaseRepository: Repository<Purchase>,
    private readonly _purchaseMapper: PurchaseMapper,
  ) {}

  async findAllPaginated(
    page: number,
    size: number,
    sortField: string,
    sortOrder: 'ASC' | 'DESC',
  ): Promise<PurchasePageResponseDTO> {
    try {
      let queryBuilder = this._dbPurchaseRepository
        .createQueryBuilder('purchase')
        .leftJoinAndSelect('purchase.purchaseItems', 'purchaseItem');

      if (sortField === 'date') {
        queryBuilder = queryBuilder.orderBy('purchase.createdAt', sortOrder);
      } else {
        // Default sort by createdAt desc
        queryBuilder = queryBuilder.orderBy('purchase.createdAt', 'DESC');
      }

      const [purchases, total] = await queryBuilder
        .skip(page * size)
        .take(size)
        .getManyAndCount();

      return this._purchaseMapper.toPaginationDTO(
        [purchases, total],
        page,
        size,
      );
    } catch (error: any) {
      logger.error('Error fetching paginated purchases', {
        page,
        size,
        sortField,
        sortOrder,
        error: error.message,
        stack: error.stack,
      });
      throw new HttpError(500, 'Failed to fetch paginated purchases');
    }
  }

  async findById(id: number): Promise<PurchaseResponseDTO | void> {
    try {
      const purchase = await this._dbPurchaseRepository
        .createQueryBuilder('purchase')
        .leftJoinAndSelect('purchase.purchaseItems', 'purchaseItem')
        .where('purchase.id = :id', { id })
        .getOne();
      if (purchase) {
        return this._purchaseMapper.toResponseDTO(purchase);
      } else {
        throw new HttpError(404, `Purchase with id ${id} not found`);
      }
    } catch (error: any) {
      logger.error('Error fetching purchase by ID', {
        id,
        error: error.message,
        stack: error.stack,
      });
      throw new HttpError(
        error.status || 500,
        error.message || 'Failed to fetch purchase',
      );
    }
  }

  async create(purchase: Purchase): Promise<PurchaseResponseDTO> {
    try {
      const savedPurchase = await this._dbPurchaseRepository.save(purchase);
      return this._purchaseMapper.toResponseDTO(savedPurchase);
    } catch (error: any) {
      logger.error('Error creating purchase', {
        error: error.message,
        stack: error.stack,
      });
      throw new HttpError(
        error.status || 500,
        error.message || 'Failed to create purchase',
      );
    }
  }

  async update(
    id: number,
    purchase: Purchase,
  ): Promise<PurchaseResponseDTO | void> {
    try {
      const existingPurchase = await this._dbPurchaseRepository.update(
        id,
        purchase,
      );
      if (existingPurchase.affected === 0) {
        throw new HttpError(404, `Purchase with id ${id} not found`);
      }
      const updatedPurchase = await this._dbPurchaseRepository.findOneBy({
        id,
      });
      if (updatedPurchase) {
        return this._purchaseMapper.toResponseDTO(updatedPurchase);
      }
    } catch (error: any) {
      logger.error('Error updating purchase', {
        id,
        error: error.message,
        stack: error.stack,
      });
      throw new HttpError(
        error.status || 500,
        error.message || `Failed to update purchase with id ${id}`,
      );
    }
  }

  async delete(id: number): Promise<PurchaseResponseDTO | void> {
    try {
      const purchase = await this._dbPurchaseRepository
        .createQueryBuilder('purchase')
        .leftJoinAndSelect('purchase.purchaseItems', 'purchaseItem')
        .where('purchase.id = :id', { id })
        .getOne();
      if (purchase) {
        await this._dbPurchaseRepository.delete(id);
        return this._purchaseMapper.toResponseDTO(purchase);
      } else {
        throw new HttpError(404, `Purchase with id ${id} not found`);
      }
    } catch (error: any) {
      logger.error('Error deleting purchase', {
        id,
        error: error.message,
        stack: error.stack,
      });
      throw new HttpError(
        error.status || 500,
        error.message || `Failed to delete purchase with id ${id}`,
      );
    }
  }
}
