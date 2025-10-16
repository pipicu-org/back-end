import { DataSource } from 'typeorm';
import { StockMovementRequestDTO } from '../models/DTO/request/stockMovementRequestDTO';
import { StockMovementResponseDTO } from '../models/DTO/response/stockMovementResponseDTO';
import { StockMovementPaginationDTO } from '../models/DTO/response/stockMovementPaginationDTO';
import { StockMovementMapper } from '../models/mappers/stockMovementMapper';
import { IStockMovementRepository } from './stockMovement.repository';
import { IStockMovementService } from './stockMovement.service';
import { Ingredient, Line, StockMovement, Unit } from '../models/entity';
import { HttpError } from '../../errors/httpError';
import logger from '../../config/logger';

export class StockMovementService implements IStockMovementService {
  constructor(
    private readonly _stockMovementRepository: IStockMovementRepository,
    private readonly _stockMovementMapper: StockMovementMapper,
    private readonly _dataSource: DataSource,
  ) {}

  async createStockMovementForOrderLine(
    line: Line,
    isUpdate: boolean = false,
    previousQuantity: number = 0,
  ): Promise<void> {
    console.log(line);
    for (const recipe of line.product.recipe.recipeIngredient) {
      const ingredient = recipe.ingredient;
      const unit = recipe.unit;
      let quantity: number;
      let stockMovementTypeId: number;

      if (isUpdate) {
        const quantityDifference = Math.abs(
          recipe.quantity * line.quantity - recipe.quantity * previousQuantity,
        );
        if (quantityDifference === 0) continue; // No change

        quantity = quantityDifference;
        stockMovementTypeId =
          recipe.quantity * line.quantity > recipe.quantity * previousQuantity
            ? 2
            : 1; // Out or Return
      } else {
        quantity = recipe.quantity * line.quantity;
        stockMovementTypeId = 2; // Out
      }

      if (ingredient.stock < quantity && stockMovementTypeId === 2) {
        throw new HttpError(
          400,
          `Insufficient stock for ingredient ${ingredient.name}`,
        );
      }
      await this.createStockMovement(
        new StockMovementRequestDTO(
          ingredient.id,
          quantity,
          unit.id,
          stockMovementTypeId,
        ),
      );
    }
  }

  async createStockMovement(
    requestDTO: StockMovementRequestDTO,
  ): Promise<StockMovement | void> {
    const queryRunner = this._dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Load ingredient
      const ingredient = await queryRunner.manager.findOne(Ingredient, {
        where: { id: requestDTO.ingredientId },
      });
      if (!ingredient) {
        throw new HttpError(
          400,
          `Ingredient with id ${requestDTO.ingredientId} not found`,
        );
      }
      const unit = await queryRunner.manager.findOneBy(Unit, {
        id: requestDTO.unitId,
      });

      if (!unit) {
        throw new HttpError(400, `Unit with id ${requestDTO.unitId} not found`);
      }
      // Adjust stock based on movement type
      if (requestDTO.stockMovementTypeId === 1) {
        // 'In'
        ingredient.stock += requestDTO.quantity;
      } else if (requestDTO.stockMovementTypeId === 2) {
        // 'Out'
        if (ingredient.stock < requestDTO.quantity) {
          throw new HttpError(
            400,
            `Insufficient stock for ingredient ${ingredient.name}`,
          );
        }
        ingredient.stock -= requestDTO.quantity;
      } else {
        throw new HttpError(
          400,
          `Invalid stock movement type id ${requestDTO.stockMovementTypeId}`,
        );
      }

      // Save updated ingredient
      await queryRunner.manager.save(Ingredient, ingredient);

      // Create and save stock movement
      const stockMovement =
        this._stockMovementMapper.requestDTOToEntity(requestDTO);
      ingredient.stockMovements ??= [];
      ingredient.stockMovements.push(stockMovement);
      stockMovement.ingredient = ingredient;
      stockMovement.unit = unit;
      const createdStockMovement =
        await queryRunner.manager.save(stockMovement);

      await queryRunner.commitTransaction();
      return createdStockMovement;
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      logger.error('Error creating stock movement with stock update', {
        error: error.message,
        stack: error.stack,
      });
      throw new HttpError(500, 'Failed to create stock movement');
    } finally {
      await queryRunner.release();
    }
  }

  async getStockMovementById(
    id: number,
  ): Promise<StockMovementResponseDTO | void> {
    try {
      return await this._stockMovementRepository.findById(id);
    } catch (error: any) {
      logger.error('Error fetching stock movement by ID', {
        id,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async getStockMovementsPaginated(
    page: number,
    limit: number,
  ): Promise<StockMovementPaginationDTO> {
    try {
      return await this._stockMovementRepository.findAllPaginated(page, limit);
    } catch (error: any) {
      logger.error('Error fetching paginated stock movements', {
        page,
        limit,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }
}
