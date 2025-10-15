import { PurchaseItem } from '../models/entity';
import { IStockMovementService } from '../stockMovement/stockMovement.service';
import { StockMovementRequestDTO } from '../models/DTO/request/stockMovementRequestDTO';

// Single Responsibility: Handles stock movement operations for purchases
export interface IStockMovementHandler {
  handleStockMovementForPurchaseItem(
    item: PurchaseItem,
    isUpdate?: boolean,
    previousQuantity?: number,
  ): Promise<void>;
}

export class StockMovementHandler implements IStockMovementHandler {
  constructor(private readonly _stockMovementService: IStockMovementService) {}

  async handleStockMovementForPurchaseItem(
    item: PurchaseItem,
    isUpdate: boolean = false,
    previousQuantity: number = 0,
  ): Promise<void> {
    const stockMovementRequest = new StockMovementRequestDTO();
    stockMovementRequest.ingredientId = item.ingredientId;
    stockMovementRequest.unitId = item.unitId;

    if (isUpdate) {
      const quantityDifference = Math.abs(item.unitQuantity - previousQuantity);
      if (quantityDifference === 0) return; // No change

      stockMovementRequest.quantity = quantityDifference;
      stockMovementRequest.stockMovementTypeId =
        item.unitQuantity > previousQuantity ? 1 : 2; // Buy or Return
    } else {
      stockMovementRequest.quantity = item.unitQuantity;
      stockMovementRequest.stockMovementTypeId = 1; // Buy
    }

    const stockMovement =
      await this._stockMovementService.createStockMovement(
        stockMovementRequest,
      );
    if (!stockMovement) {
      throw new Error('Failed to create stock movement');
    }

    // Attach to item
    if (item.stockMovements) {
      item.stockMovements.push(stockMovement);
    } else {
      item.stockMovements = [stockMovement];
    }
  }
}
