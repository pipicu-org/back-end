import { Ingredient } from '../../entity/ingredient';

interface IIngredientResponseDTO {
  id: number;
  name: string;
  price: number;
}

export class IngredientResponseDTO implements IIngredientResponseDTO {
  id: number;
  name: string;
  price: number;

  constructor(ingredient: Ingredient) {
    this.id = ingredient.id;
    this.name = ingredient.name;
    this.price = ingredient.price;
  }
}
