import { Ingredient } from '../../entity/ingredient';

export class IngredientResponseDTO {
  id: number;
  name: string;
  unitId: number;
  lossFactor: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(ingredient: Ingredient) {
    this.id = ingredient.id;
    this.name = ingredient.name;
    this.unitId = ingredient.unitId;
    this.lossFactor = ingredient.lossFactor;
    this.stock = ingredient.stock;
    this.createdAt = ingredient.createdAt;
    this.updatedAt = ingredient.updatedAt;
  }
}
