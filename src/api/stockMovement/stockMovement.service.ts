import { StockMovementRequestDTO } from '../models/DTO/request/stockMovementRequestDTO';
import { StockMovementResponseDTO } from '../models/DTO/response/stockMovementResponseDTO';
import { StockMovementPaginationDTO } from '../models/DTO/response/stockMovementPaginationDTO';
import { Line, StockMovement } from '../models/entity';

export interface IStockMovementService {
  createStockMovement(
    requestDTO: StockMovementRequestDTO,
  ): Promise<StockMovement | void>;
  getStockMovementById(id: number): Promise<StockMovementResponseDTO | void>;
  getStockMovementsPaginated(
    page: number,
    limit: number,
  ): Promise<StockMovementPaginationDTO>;
  createStockMovementForOrderLine(line: Line): Promise<void>;
}
