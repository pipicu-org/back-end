import { Ingredient } from '../../../api/models/entity';
import { ISeed } from '../ISeed';

export class IngredientSeed implements ISeed<Ingredient> {
  static instance: IngredientSeed;

  static getInstance(): IngredientSeed {
    if (!IngredientSeed.instance) {
      IngredientSeed.instance = new IngredientSeed();
    }
    return IngredientSeed.instance;
  }

  entity: string = 'Ingredient';
  data: Ingredient[] = [
    {
      id: 1,
      name: 'Jamon',
      price: 100,
      recipeIngredients: [],
    },
  ];

  getEntity(): string {
    return this.entity;
  }

  getData(): Ingredient[] {
    return this.data;
  }
}
