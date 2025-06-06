export interface IRecipeRequestDTO {
  ingredientId: number;
  quantity: number;
}

export class RecipeRequestDTO implements IRecipeRequestDTO {
  ingredientId: number;
  quantity: number;

  constructor(ingredientId: number, quantity: number) {
    this.ingredientId = ingredientId;
    this.quantity = quantity;
  }
}
