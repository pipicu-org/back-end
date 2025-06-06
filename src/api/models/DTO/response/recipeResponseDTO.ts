import { Recipe } from '../../recipe';

export interface IRecipeResponseDTO {
  id: number;
  ingredient: {
    id: number;
    name: string;
    price: number;
  };
  quantity: number;
  totalPrice: number;
}

export class RecipeResponseDTO implements IRecipeResponseDTO {
  id: number;
  ingredient: {
    id: number;
    name: string;
    price: number;
  };
  quantity: number;
  totalPrice: number;

  constructor(recipe: Recipe) {
    this.id = recipe.id;
    this.ingredient = {
      id: recipe.ingredient.id,
      name: recipe.ingredient.name,
      price: recipe.ingredient.price,
    };
    this.quantity = recipe.quantity;
    this.totalPrice = recipe.totalPrice;
  }
}
