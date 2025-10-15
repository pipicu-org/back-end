import { DataSource, Repository } from 'typeorm';
import { Purchase, PurchaseItem } from '../models/entity';
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
  findItemsByPurchaseId(purchaseId: number): Promise<PurchaseItem[]>;
}

export class PurchaseRepository implements IPurchaseRepository {
  constructor(
    private readonly _dbPurchaseRepository: Repository<Purchase>,
    private readonly _purchaseMapper: PurchaseMapper,
    private readonly _dataSource: DataSource,
  ) {}

  async findItemsByPurchaseId(purchaseId: number): Promise<PurchaseItem[]> {
    const queryRunner = this._dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const purchaseItems = await queryRunner.manager.find(PurchaseItem, {
        where: {
          purchaseId,
        },
      });
      await queryRunner.commitTransaction();
      return purchaseItems;
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      logger.error('Error finding purchase items by purchaseId', {
        purchaseId,
        error: error.message,
        stack: error.stack,
      });
      throw new HttpError(
        error.status || 500,
        error.message ||
          `Failed to find purchase items for purchaseId ${purchaseId}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

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
    const queryRunner = this._dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (const item of purchase.purchaseItems) {
        item.purchase = purchase;
        item.purchaseId = purchase.id;
        console.log(
          'Item in create method (purchase.repository line 166)',
          item,
        );
      }

      const savedPurchase = await queryRunner.manager.save(purchase);
      await queryRunner.commitTransaction();
      return this._purchaseMapper.toResponseDTO(savedPurchase);
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      logger.error('Error creating purchase', {
        error: error.message,
        stack: error.stack,
      });
      throw new HttpError(
        error.status || 500,
        error.message || 'Failed to create purchase',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async update(
    id: number,
    purchase: Purchase,
  ): Promise<PurchaseResponseDTO | void> {
    try {
      purchase.id = id;
      for (const item of purchase.purchaseItems) {
        item.purchaseId = id;
      }
      await this._dbPurchaseRepository.save(purchase);
      const updatedPurchase = await this._dbPurchaseRepository
        .createQueryBuilder('purchase')
        .leftJoinAndSelect('purchase.purchaseItems', 'purchaseItem')
        .where('purchase.id = :id', { id })
        .getOne();
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
    const queryRunner = this._dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const purchase = await this._dbPurchaseRepository
        .createQueryBuilder('purchase')
        .leftJoinAndSelect('purchase.purchaseItems', 'purchaseItem')
        .where('purchase.id = :id', { id })
        .getOne();
      if (purchase) {
        await this._dbPurchaseRepository.delete(id);
        await queryRunner.commitTransaction();
        return this._purchaseMapper.toResponseDTO(purchase);
      } else {
        throw new HttpError(404, `Purchase with id ${id} not found`);
      }
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      logger.error('Error deleting purchase', {
        id,
        error: error.message,
        stack: error.stack,
      });
      throw new HttpError(
        error.status || 500,
        error.message || `Failed to delete purchase with id ${id}`,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
