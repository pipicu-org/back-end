import { StockMovement } from '../../entity/stockMovement';

export interface IIngredientInfo {
  id: number;
  name: string;
}

export interface IStockMovementTypeInfo {
  id: number;
  name: string;
}

export interface IUnitInfo {
  id: number;
  name: string;
}

export interface IPurchaseItemInfo {
  id: number;
  ingredientName?: string;
}

export class StockMovementResponseDTO {
  id: number;
  ingredientId: number;
  ingredient?: IIngredientInfo;
  quantity: number;
  unitId: number;
  unit?: IUnitInfo;
  stockMovementTypeId: number;
  stockMovementType?: IStockMovementTypeInfo;
  purchaseItemId: number | null;
  purchaseItem?: IPurchaseItemInfo;
  createdAt: Date;
  updatedAt: Date;

  constructor(stockMovement: StockMovement) {
    this.id = stockMovement.id;
    this.ingredientId = stockMovement.ingredientId;
    this.quantity = Number(stockMovement.quantity);
    this.unitId = stockMovement.unitId;
    this.stockMovementTypeId = stockMovement.stockMovementTypeId;
    this.purchaseItemId = stockMovement.purchaseItemId;
    this.createdAt = stockMovement.createdAt;
    this.updatedAt = stockMovement.updatedAt;
    
    // Include ingredient information if available
    if (stockMovement.ingredient) {
      this.ingredient = {
        id: stockMovement.ingredient.id,
        name: stockMovement.ingredient.name,
      };
    }
    
    // Include unit information if available
    if (stockMovement.unit) {
      this.unit = {
        id: stockMovement.unit.id,
        name: stockMovement.unit.name,
      };
    }
    
    // Include stock movement type information if available
    if (stockMovement.stockMovementType) {
      this.stockMovementType = {
        id: stockMovement.stockMovementType.id,
        name: stockMovement.stockMovementType.name,
      };
    }
    
    // Include purchase item information if available
    if (stockMovement.purchaseItem) {
      this.purchaseItem = {
        id: stockMovement.purchaseItem.id,
        ingredientName: stockMovement.purchaseItem.ingredient?.name,
      };
    }
  }
}
