import { StockMovement } from '../../entity/stockMovement';

export class StockMovementResponseDTO {
  id: number;
  ingredient: {
    id: number;
    name: string;
  };
  quantity: number;
  unit: {
    id: number;
    name: string;
  };
  stockMovementType: {
    id: number;
    name: string;
  };
  purchaseItemId: number | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(stockMovement: StockMovement) {
    this.id = stockMovement.id;
    this.ingredient = {
      id: stockMovement.ingredientId,
      name: stockMovement.ingredient.name,
    };
    this.quantity = stockMovement.quantity;
    this.unit = {
      id: stockMovement.unitId,
      name: stockMovement.unit.name,
    };
    this.stockMovementType = {
      id: stockMovement.stockMovementTypeId,
      name: stockMovement.stockMovementType.name,
    };
    this.purchaseItemId = stockMovement.purchaseItemId;
    this.createdAt = stockMovement.createdAt;
    this.updatedAt = stockMovement.updatedAt;
  }
}
