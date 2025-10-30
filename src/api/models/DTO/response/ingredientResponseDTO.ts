import { Ingredient } from '../../entity/ingredient';

export class IngredientResponseDTO {
  id: number;
  name: string;
  unit: {
    id: number;
    name: string;
  };
  lossFactor: number;
  cost?: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(ingredient: Ingredient) {
    this.id = ingredient.id;
    this.name = ingredient.name;
    this.unit = {
      id: ingredient.unit.id,
      name: ingredient.unit.name,
    };
    this.lossFactor = ingredient.lossFactor;
    this.cost = ingredient.cost;
    this.stock = ingredient.stock;
    this.createdAt = ingredient.createdAt;
    this.updatedAt = ingredient.updatedAt;
  }
}
