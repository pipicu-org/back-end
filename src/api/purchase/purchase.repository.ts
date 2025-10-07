import { Repository } from 'typeorm';
import { Purchase } from '../models/entity';
import { PurchaseResponseDTO } from '../models/DTO/response/purchaseResponseDTO';
import { PurchaseMapper } from '../models/mappers/purchaseMapper';
import { HttpError } from '../../errors/httpError';
import logger from '../../config/logger';

export interface IPurchaseRepository {
  findAll(): Promise<PurchaseResponseDTO[]>;
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

  async findAll(): Promise<PurchaseResponseDTO[]> {
    try {
      const purchases = await this._dbPurchaseRepository
        .createQueryBuilder('purchase')
        .leftJoinAndSelect('purchase.purchaseItems', 'purchaseItem')
        .getMany();
      return purchases.map(purchase => this._purchaseMapper.toResponseDTO(purchase));
    } catch (error: any) {
      logger.error('Error fetching all purchases', { error: error.message, stack: error.stack });
      throw new HttpError(500, 'Failed to fetch purchases');
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
      logger.error('Error fetching purchase by ID', { id, error: error.message, stack: error.stack });
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
      logger.error('Error creating purchase', { error: error.message, stack: error.stack });
      throw new HttpError(
        error.status || 500,
        error.message || 'Failed to create purchase',
      );
    }
  }

  async update(id: number, purchase: Purchase): Promise<PurchaseResponseDTO | void> {
    try {
      const existingPurchase = await this._dbPurchaseRepository.update(id, purchase);
      if (existingPurchase.affected === 0) {
        throw new HttpError(404, `Purchase with id ${id} not found`);
      }
      const updatedPurchase = await this._dbPurchaseRepository.findOneBy({ id });
      if (updatedPurchase) {
        return this._purchaseMapper.toResponseDTO(updatedPurchase);
      }
    } catch (error: any) {
      logger.error('Error updating purchase', { id, error: error.message, stack: error.stack });
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
      logger.error('Error deleting purchase', { id, error: error.message, stack: error.stack });
      throw new HttpError(
        error.status || 500,
        error.message || `Failed to delete purchase with id ${id}`,
      );
    }
  }
}