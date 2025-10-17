export class CustomProductRequestDTO {
  baseProductId: string;
  ingredients: Array<{ id: number; quantity: number }>;

  constructor(
    baseProductId: string,
    ingredients: Array<{ id: number; quantity: number }>,
  ) {
    this.baseProductId = baseProductId;
    this.ingredients = ingredients;
  }
}
