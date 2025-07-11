import { Ingredient } from '../../entity/ingredient';

export class IngredientResponseDTO {
  id: number;
  name: string;
  price: number;

  constructor(ingredient: Ingredient) {
    this.id = ingredient.id;
    this.name = ingredient.name;
    this.price = ingredient.price;
  }
}
