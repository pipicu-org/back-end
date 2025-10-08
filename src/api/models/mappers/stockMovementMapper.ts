import { StockMovementRequestDTO } from '../DTO/request/stockMovementRequestDTO';
import { StockMovementResponseDTO } from '../DTO/response/stockMovementResponseDTO';
import { StockMovementPaginationDTO } from '../DTO/response/stockMovementPaginationDTO';
import { StockMovement } from '../entity';

export interface IStockMovementEntityMapper {
  requestDTOToEntity(requestDTO: StockMovementRequestDTO): StockMovement;
  toEntity(stockMovement: StockMovementResponseDTO): StockMovement;
}

export interface IStockMovementResponseMapper {
  toResponseDTO(stockMovement: StockMovement): StockMovementResponseDTO;
}

export interface IStockMovementPaginationMapper {
  toPaginationDTO(
    resultsAndCount: [StockMovement[], number],
    page: number,
    limit: number,
  ): StockMovementPaginationDTO;
}

export class StockMovementMapper
  implements
    IStockMovementEntityMapper,
    IStockMovementResponseMapper,
    IStockMovementPaginationMapper
{
  public toResponseDTO(stockMovement: StockMovement): StockMovementResponseDTO {
    return new StockMovementResponseDTO(stockMovement);
  }

  public requestDTOToEntity(
    requestDTO: StockMovementRequestDTO,
  ): StockMovement {
    try {
      const stockMovement = new StockMovement();
      stockMovement.ingredientId = requestDTO.ingredientId;
      stockMovement.quantity = requestDTO.quantity;
      stockMovement.unitId = requestDTO.unitId;
      stockMovement.stockMovementTypeId = requestDTO.stockMovementTypeId;
      stockMovement.purchaseItemId = requestDTO.purchaseItemId || null;
      return stockMovement;
    } catch (error) {
      throw new Error(
        `Failed to map StockMovementRequestDTO to StockMovement: ${error}`,
      );
    }
  }

  public toEntity(stockMovement: StockMovementResponseDTO): StockMovement {
    const entity = new StockMovement();
    entity.id = stockMovement.id;
    entity.ingredientId = stockMovement.ingredientId;
    entity.quantity = stockMovement.quantity;
    entity.unitId = stockMovement.unitId;
    entity.stockMovementTypeId = stockMovement.stockMovementTypeId;
    entity.purchaseItemId = stockMovement.purchaseItemId;
    entity.createdAt = stockMovement.createdAt;
    entity.updatedAt = stockMovement.updatedAt;
    return entity;
  }

  public toPaginationDTO(
    resultsAndCount: [StockMovement[], number],
    page: number,
    limit: number,
  ): StockMovementPaginationDTO {
    return new StockMovementPaginationDTO(
      resultsAndCount[1],
      page,
      limit,
      resultsAndCount[0].map((stockMovement) => ({
        id: stockMovement.id,
        ingredientId: stockMovement.ingredientId,
        quantity: stockMovement.quantity,
        unitId: stockMovement.unitId,
        stockMovementTypeId: stockMovement.stockMovementTypeId,
        purchaseItemId: stockMovement.purchaseItemId,
        createdAt: stockMovement.createdAt.toISOString(),
        updatedAt: stockMovement.updatedAt.toISOString(),
      })),
    );
  }
}
