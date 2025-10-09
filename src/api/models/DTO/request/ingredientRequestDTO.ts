interface IIngredientRequestDTO {
  name: string;
  unitId: number;
  lossFactor: number;
}

export class IngredientRequestDTO implements IIngredientRequestDTO {
  name: string;
  unitId: number;
  lossFactor: number;

  constructor(name: string, unitId: number, lossFactor: number) {
    this.name = name;
    this.unitId = unitId;
    this.lossFactor = lossFactor;
  }
}
