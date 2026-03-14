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
  findAllPaginated(
    page: number,
    limit: number,
    search?: string,
    ingredientId?: number,
    stockMovementTypeId?: number,
    unitId?: number,
    purchaseItemId?: number,
    minQuantity?: number,
    maxQuantity?: number,
    startDate?: Date,
    endDate?: Date,
    sortBy?: string,
    sortOrder?: 'ASC' | 'DESC',
  ): Promise<StockMovementPaginationDTO>;
}

export class StockMovementRepository implements IStockMovementRepository {
  constructor(
    private readonly _dbStockMovementRepository: Repository<StockMovement>,
    private readonly _stockMovementMapper: StockMovementMapper,
  ) {}

  async findById(id: number): Promise<StockMovementResponseDTO | void> {
    try {
      const stockMovement = await this._dbStockMovementRepository
        .createQueryBuilder('stockMovement')
        .leftJoinAndSelect('stockMovement.ingredient', 'ingredient')
        .leftJoinAndSelect('stockMovement.unit', 'unit')
        .leftJoinAndSelect('stockMovement.stockMovementType', 'stockMovementType')
        .leftJoinAndSelect('stockMovement.purchaseItem', 'purchaseItem')
        .leftJoinAndSelect('purchaseItem.ingredient', 'purchaseItemIngredient')
        .where('stockMovement.id = :id', { id })
        .getOne();
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
      // Fetch with relations for the response
      const stockMovementWithRelations = await this._dbStockMovementRepository
        .createQueryBuilder('stockMovement')
        .leftJoinAndSelect('stockMovement.ingredient', 'ingredient')
        .leftJoinAndSelect('stockMovement.unit', 'unit')
        .leftJoinAndSelect('stockMovement.stockMovementType', 'stockMovementType')
        .leftJoinAndSelect('stockMovement.purchaseItem', 'purchaseItem')
        .leftJoinAndSelect('purchaseItem.ingredient', 'purchaseItemIngredient')
        .where('stockMovement.id = :id', { id: createdStockMovement.id })
        .getOne();
      return this._stockMovementMapper.toResponseDTO(stockMovementWithRelations!);
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
    search?: string,
    ingredientId?: number,
    stockMovementTypeId?: number,
    unitId?: number,
    purchaseItemId?: number,
    minQuantity?: number,
    maxQuantity?: number,
    startDate?: Date,
    endDate?: Date,
    sortBy?: string,
    sortOrder: 'ASC' | 'DESC' = 'DESC',
  ): Promise<StockMovementPaginationDTO> {
    try {
      let queryBuilder = this._dbStockMovementRepository
        .createQueryBuilder('stockMovement')
        .leftJoinAndSelect('stockMovement.ingredient', 'ingredient')
        .leftJoinAndSelect('stockMovement.unit', 'unit')
        .leftJoinAndSelect('stockMovement.stockMovementType', 'stockMovementType')
        .leftJoinAndSelect('stockMovement.purchaseItem', 'purchaseItem')
        .leftJoinAndSelect('purchaseItem.ingredient', 'purchaseItemIngredient');

      // Apply filters
      if (search) {
        queryBuilder = queryBuilder.andWhere(
          '(ingredient.name ILIKE :search OR stockMovementType.name ILIKE :search)',
          { search: `%${search}%` },
        );
      }

      if (ingredientId) {
        queryBuilder = queryBuilder.andWhere(
          'stockMovement.ingredientId = :ingredientId',
          { ingredientId },
        );
      }

      if (stockMovementTypeId) {
        queryBuilder = queryBuilder.andWhere(
          'stockMovement.stockMovementTypeId = :stockMovementTypeId',
          { stockMovementTypeId },
        );
      }

      if (unitId) {
        queryBuilder = queryBuilder.andWhere(
          'stockMovement.unitId = :unitId',
          { unitId },
        );
      }

      if (purchaseItemId) {
        queryBuilder = queryBuilder.andWhere(
          'stockMovement.purchaseItemId = :purchaseItemId',
          { purchaseItemId },
        );
      }

      if (minQuantity !== undefined) {
        queryBuilder = queryBuilder.andWhere(
          'stockMovement.quantity >= :minQuantity',
          { minQuantity },
        );
      }

      if (maxQuantity !== undefined) {
        queryBuilder = queryBuilder.andWhere(
          'stockMovement.quantity <= :maxQuantity',
          { maxQuantity },
        );
      }

      if (startDate) {
        queryBuilder = queryBuilder.andWhere(
          'stockMovement.createdAt >= :startDate',
          { startDate },
        );
      }

      if (endDate) {
        queryBuilder = queryBuilder.andWhere(
          'stockMovement.createdAt <= :endDate',
          { endDate },
        );
      }

      // Apply sorting
      const validSortFields: Record<string, string> = {
        id: 'stockMovement.id',
        quantity: 'stockMovement.quantity',
        ingredient: 'ingredient.name',
        stockMovementType: 'stockMovementType.name',
        unit: 'unit.name',
        purchaseItem: 'purchaseItem.id',
        createdAt: 'stockMovement.createdAt',
      };

      const sortField = validSortFields[sortBy || 'createdAt'] || 'stockMovement.createdAt';
      queryBuilder = queryBuilder.orderBy(sortField, sortOrder);

      const stockMovements = await queryBuilder
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
