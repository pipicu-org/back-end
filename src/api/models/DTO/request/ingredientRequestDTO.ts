interface IIngredientRequestDTO {
  name: string;
  unitId: number;
  lossFactor: number;
  cost?: number;
}

export class IngredientRequestDTO implements IIngredientRequestDTO {
  name: string;
  unitId: number;
  lossFactor: number;
  cost?: number;

  constructor(name: string, unitId: number, lossFactor: number, cost?: number) {
    this.name = name;
    this.unitId = unitId;
    this.lossFactor = lossFactor;
    this.cost = cost;
  }
}
