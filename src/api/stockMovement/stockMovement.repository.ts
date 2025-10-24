import { Repository } from 'typeorm';
import { StockMovement } from '../models/entity';
import { HttpError } from '../../errors/httpError';

export interface IStockMovementRepository {
  findById(id: number): Promise<StockMovement | void>;
  create(stockMovement: StockMovement): Promise<StockMovement | void>;
  findAllPaginated(
    page: number,
    limit: number,
  ): Promise<[StockMovement[], number]>;
}

export class StockMovementRepository implements IStockMovementRepository {
  constructor(
    private readonly _dbStockMovementRepository: Repository<StockMovement>,
  ) {}

  async findById(id: number): Promise<StockMovement | void> {
    try {
      const stockMovement = await this._dbStockMovementRepository.findOne({
        where: { id },
        relations: ['ingredient', 'unit', 'stockMovementType'],
      });
      if (!stockMovement) {
        throw new HttpError(404, `StockMovement with id ${id} not found`);
      }
      return stockMovement;
    } catch (error: any) {
      console.error(`Error fetching stockMovement with id ${id}:`, error);
      throw new HttpError(
        error.status || 500,
        error.message || `Could not fetch stockMovement with id ${id}`,
      );
    }
  }

  async create(stockMovement: StockMovement): Promise<StockMovement | void> {
    try {
      await this._dbStockMovementRepository.save(stockMovement);
      const createdStockMovement = await this._dbStockMovementRepository
        .createQueryBuilder('stockMovement')
        .leftJoinAndSelect('stockMovement.ingredient', 'ingredient')
        .leftJoinAndSelect('stockMovement.unit', 'unit')
        .leftJoinAndSelect(
          'stockMovement.stockMovementType',
          'stockMovementType',
        )
        .where('stockMovement.id = :id', { id: stockMovement.id })
        .getOne();
      if (!createdStockMovement) {
        throw new HttpError(
          500,
          'Failed to retrieve created stock movement after saving',
        );
      }
      return createdStockMovement;
    } catch (error: any) {
      console.error('Error creating stockMovement:', error);
      throw new HttpError(
        error.status || 500,
        error.message || 'Could not create stockMovement',
      );
    }
  }

  async findAllPaginated(
    page: number,
    limit: number,
  ): Promise<[StockMovement[], number]> {
    try {
      const [stockMovements, total] = await this._dbStockMovementRepository
        .createQueryBuilder('stockMovement')
        .leftJoinAndSelect('stockMovement.ingredient', 'ingredient')
        .leftJoinAndSelect('stockMovement.unit', 'unit')
        .leftJoinAndSelect(
          'stockMovement.stockMovementType',
          'stockMovementType',
        )
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();
      return [stockMovements, total];
    } catch (error: any) {
      console.error('Error fetching paginated stockMovements:', error);
      throw new HttpError(
        error.status || 500,
        error.message || 'Internal Server Error',
      );
    }
  }
}
