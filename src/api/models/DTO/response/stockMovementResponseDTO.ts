import { StockMovement } from '../../entity/stockMovement';

export class StockMovementResponseDTO {
  id: number;
  ingredientId: number;
  quantity: number;
  unitId: number;
  stockMovementTypeId: number;
  purchaseItemId: number | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(stockMovement: StockMovement) {
    this.id = stockMovement.id;
    this.ingredientId = stockMovement.ingredientId;
    this.quantity = stockMovement.quantity;
    this.unitId = stockMovement.unitId;
    this.stockMovementTypeId = stockMovement.stockMovementTypeId;
    this.purchaseItemId = stockMovement.purchaseItemId;
    this.createdAt = stockMovement.createdAt;
    this.updatedAt = stockMovement.updatedAt;
  }
}
