import { StockMovement } from '../../entity/stockMovement';

export class StockMovementResponseDTO {
  id: number;
  ingredientId: number;
  ingredientName: string;
  quantity: number;
  unitId: number;
  unitName: string;
  stockMovementTypeId: number;
  purchaseItemId: number | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(stockMovement: StockMovement) {
    this.id = stockMovement.id;
    this.ingredientId = stockMovement.ingredientId;
    this.ingredientName = stockMovement.ingredient.name;
    this.quantity = stockMovement.quantity;
    this.unitId = stockMovement.unitId;
    this.unitName = stockMovement.unit.name;
    this.stockMovementTypeId = stockMovement.stockMovementTypeId;
    this.purchaseItemId = stockMovement.purchaseItemId;
    this.createdAt = stockMovement.createdAt;
    this.updatedAt = stockMovement.updatedAt;
  }
}
