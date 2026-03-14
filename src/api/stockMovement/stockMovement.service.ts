import { StockMovementRequestDTO } from '../models/DTO/request/stockMovementRequestDTO';
import { StockMovementResponseDTO } from '../models/DTO/response/stockMovementResponseDTO';
import { StockMovementPaginationDTO } from '../models/DTO/response/stockMovementPaginationDTO';
import { StockMovement } from '../models/entity';

export interface IStockMovementService {
  createStockMovement(
    requestDTO: StockMovementRequestDTO,
  ): Promise<StockMovement | void>;
  getStockMovementById(id: number): Promise<StockMovementResponseDTO | void>;
  getStockMovementsPaginated(
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
