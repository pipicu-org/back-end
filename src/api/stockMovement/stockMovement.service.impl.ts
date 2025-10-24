import { StockMovementRequestDTO } from '../models/DTO/request/stockMovementRequestDTO';
import { StockMovementResponseDTO } from '../models/DTO/response/stockMovementResponseDTO';
import { StockMovementPaginationDTO } from '../models/DTO/response/stockMovementPaginationDTO';
import { StockMovementMapper } from '../models/mappers/stockMovementMapper';
import { IStockMovementRepository } from './stockMovement.repository';
import { IStockMovementService } from './stockMovement.service';
import { Line } from '../models/entity';
import { HttpError } from '../../errors/httpError';
import logger from '../../config/logger';
import { IIngredientService } from '../ingredient/ingredient.service';
import { IUnitService } from '../unit/unit.service';

export class StockMovementService implements IStockMovementService {
  constructor(
    private readonly _stockMovementRepository: IStockMovementRepository,
    private readonly _stockMovementMapper: StockMovementMapper,
    private readonly _unitService: IUnitService,
    private readonly _ingredientService: IIngredientService,
  ) {}

  async createStockMovementForOrderLine(
    line: Line,
    isUpdate: boolean = false,
    previousQuantity: number = 0,
  ): Promise<void> {
    for (const recipe of line.product.recipe.recipeIngredient) {
      const ingredient = recipe.ingredient;
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
            : 1;
      } else {
        quantity = recipe.quantity * line.quantity;
        stockMovementTypeId = 2; // Out
      }

      await this.createStockMovement(
        new StockMovementRequestDTO(
          ingredient.id,
          quantity,
          recipe.unitId,
          stockMovementTypeId,
        ),
      );
    }
  }

  async createStockMovement(
    requestDTO: StockMovementRequestDTO,
  ): Promise<StockMovementResponseDTO | void> {
    try {
      // Load ingredient
      const ingredient = await this._ingredientService.getIngredientById(
        requestDTO.ingredientId,
      );
      if (!ingredient) {
        throw new HttpError(
          400,
          `Ingredient with id ${requestDTO.ingredientId} not found`,
        );
      }
      const unit = await this._unitService.getUnitById(requestDTO.unitId);
      if (!unit) {
        throw new HttpError(400, `Unit with id ${requestDTO.unitId} not found`);
      }
      // Adjust stock based on movement type
      if (requestDTO.stockMovementTypeId === 1) {
        // 'In'
        ingredient.stock += requestDTO.quantity;
      } else if (requestDTO.stockMovementTypeId === 2) {
        // 'Out'
        ingredient.stock -= requestDTO.quantity;
      } else {
        throw new HttpError(
          400,
          `Invalid stock movement type id ${requestDTO.stockMovementTypeId}`,
        );
      }

      // Save updated ingredient
      await this._ingredientService.updateIngredient(
        requestDTO.ingredientId,
        ingredient,
      );

      // Create and save stock movement
      const stockMovement =
        this._stockMovementMapper.requestDTOToEntity(requestDTO);
      stockMovement.ingredientId = ingredient.id;
      stockMovement.unitId = unit.id;
      await this._stockMovementRepository.create(stockMovement);
      const createdStockMovement = await this._stockMovementRepository.findById(
        stockMovement.id,
      );
      if (!createdStockMovement) {
        throw new HttpError(
          500,
          'Failed to retrieve created stock movement after saving',
        );
      }
      return createdStockMovement;
    } catch (error: any) {
      logger.error('Error creating stock movement with stock update', {
        error: error.message,
        stack: error.stack,
      });
      throw new HttpError(500, 'Failed to create stock movement');
    }
  }

  async getStockMovementById(
    id: number,
  ): Promise<StockMovementResponseDTO | void> {
    try {
      const stockMovement = await this._stockMovementRepository.findById(id);
      if (!stockMovement) {
        throw new HttpError(404, `Stock movement with id ${id} not found`);
      }
      return new StockMovementResponseDTO(stockMovement);
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
      const [stockMovements, total] =
        await this._stockMovementRepository.findAllPaginated(page, limit);
      return this._stockMovementMapper.toPaginationDTO(
        [stockMovements, total],
        page,
        limit,
      );
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
