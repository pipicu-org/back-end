interface IIngredientRequestDTO {
  name: string;
  price: number;
}

export class IngredientRequestDTO implements IIngredientRequestDTO {
  name: string;
  price: number;

  constructor(name: string, price: number) {
    this.name = name;
    this.price = price;
  }
}
