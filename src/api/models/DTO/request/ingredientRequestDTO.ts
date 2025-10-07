interface IIngredientRequestDTO {
  name: string;
  price: number;
}

export class IngredientRequestDTO implements IIngredientRequestDTO {
  name: string;
  price: number;
  unitId: number;
  lossFactor: number;

  constructor(name: string, price: number, unitId: number, lossFactor: number) {
    this.name = name;
    this.price = price;
    this.unitId = unitId;
    this.lossFactor = lossFactor;
  }
}
