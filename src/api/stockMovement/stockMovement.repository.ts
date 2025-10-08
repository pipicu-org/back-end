import { Repository } from 'typeorm';
import { StockMovement } from '../models/entity';
import { StockMovementMapper } from '../models/mappers/stockMovementMapper';
import { StockMovementResponseDTO } from '../models/DTO/response/stockMovementResponseDTO';
import { StockMovementPaginationDTO } from '../models/DTO/response/stockMovementPaginationDTO';
import { HttpError } from '../../errors/httpError';

export interface IStockMovementRepository {
  findById(id: number): Promise<StockMovementResponseDTO | void>;
  create(
    stockMovement: StockMovement,
  ): Promise<StockMovementResponseDTO | void>;
  update(
    id: number,
    stockMovement: StockMovement,
  ): Promise<StockMovementResponseDTO | void>;
  delete(id: number): Promise<StockMovementResponseDTO | void>;
  findAllPaginated(
    page: number,
    limit: number,
  ): Promise<StockMovementPaginationDTO>;
}

export class StockMovementRepository implements IStockMovementRepository {
  constructor(
    private readonly _dbStockMovementRepository: Repository<StockMovement>,
    private readonly _stockMovementMapper: StockMovementMapper,
  ) {}

  async findById(id: number): Promise<StockMovementResponseDTO | void> {
    try {
      const stockMovement = await this._dbStockMovementRepository.findOneBy({
        id,
      });
      if (!stockMovement) {
        throw new HttpError(404, `StockMovement with id ${id} not found`);
      }
      return this._stockMovementMapper.toResponseDTO(stockMovement);
    } catch (error: any) {
      console.error(`Error fetching stockMovement with id ${id}:`, error);
      throw new HttpError(
        error.status || 500,
        error.message || `Could not fetch stockMovement with id ${id}`,
      );
    }
  }

  async create(
    stockMovement: StockMovement,
  ): Promise<StockMovementResponseDTO | void> {
    try {
      const createdStockMovement =
        await this._dbStockMovementRepository.save(stockMovement);
      return this._stockMovementMapper.toResponseDTO(createdStockMovement);
    } catch (error: any) {
      console.error('Error creating stockMovement:', error);
      throw new HttpError(
        error.status || 500,
        error.message || 'Could not create stockMovement',
      );
    }
  }

  async update(
    id: number,
    stockMovement: StockMovement,
  ): Promise<StockMovementResponseDTO | void> {
    try {
      const existingStockMovement =
        await this._dbStockMovementRepository.update(id, stockMovement);
      if (existingStockMovement.affected === 0) {
        throw new Error(`StockMovement with id ${id} not found`);
      }
      const updatedStockMovement = await this._dbStockMovementRepository
        .createQueryBuilder('stockMovement')
        .where('stockMovement.id = :id', { id })
        .getOne();
      if (!updatedStockMovement) {
        throw new HttpError(404, `StockMovement with id ${id} not found`);
      }
      return this._stockMovementMapper.toResponseDTO(updatedStockMovement);
    } catch (error: any) {
      console.error(`Error updating stockMovement with id ${id}:`, error);
      throw new HttpError(
        error.status || 500,
        error.message || `Could not update stockMovement with id ${id}`,
      );
    }
  }

  async delete(id: number): Promise<StockMovementResponseDTO | void> {
    try {
      const existingStockMovement =
        await this._dbStockMovementRepository.findOneBy({
          id,
        });
      if (existingStockMovement) {
        await this._dbStockMovementRepository.delete(id);
        return this._stockMovementMapper.toResponseDTO(existingStockMovement);
      } else {
        throw new HttpError(404, `StockMovement with id ${id} not found`);
      }
    } catch (error: any) {
      console.error(`Error deleting stockMovement with id ${id}:`, error);
      throw new HttpError(
        error.status || 500,
        error.message || `Could not delete stockMovement with id ${id}`,
      );
    }
  }

  async findAllPaginated(
    page: number,
    limit: number,
  ): Promise<StockMovementPaginationDTO> {
    try {
      const stockMovements = await this._dbStockMovementRepository
        .createQueryBuilder('stockMovement')
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();
      return this._stockMovementMapper.toPaginationDTO(
        stockMovements,
        page,
        limit,
      );
    } catch (error: any) {
      console.error('Error fetching paginated stockMovements:', error);
      throw new HttpError(
        error.status || 500,
        error.message || 'Internal Server Error',
      );
    }
  }
}
