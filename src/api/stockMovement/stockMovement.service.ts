import { StockMovementRequestDTO } from '../models/DTO/request/stockMovementRequestDTO';
import { StockMovementResponseDTO } from '../models/DTO/response/stockMovementResponseDTO';
import { StockMovementPaginationDTO } from '../models/DTO/response/stockMovementPaginationDTO';
import { Line } from '../models/entity';

export interface IStockMovementService {
  createStockMovement(
    requestDTO: StockMovementRequestDTO,
  ): Promise<StockMovementResponseDTO | void>;
  getStockMovementById(id: number): Promise<StockMovementResponseDTO | void>;
  getStockMovementsPaginated(
    page: number,
    limit: number,
  ): Promise<StockMovementPaginationDTO>;
  createStockMovementForOrderLine(
    line: Line,
    isUpdate?: boolean,
    previousQuantity?: number,
  ): Promise<void>;
}
