interface IIngredientRequestDTO {
  name: string;
  unitId: number;
  lossFactor: number;
  cost: number;
  stock: number;
}

export class IngredientRequestDTO implements IIngredientRequestDTO {
  name: string;
  unitId: number;
  lossFactor: number;
  cost: number;
  stock: number;

  constructor(
    name: string,
    unitId: number,
    lossFactor: number,
    stock: number,
    cost?: number,
  ) {
    this.name = name;
    this.unitId = unitId;
    this.lossFactor = lossFactor;
    this.cost = cost || 0;
    this.stock = stock;
  }
}
