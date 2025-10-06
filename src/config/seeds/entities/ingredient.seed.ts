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
      unitId: 1,
      recipeIngredient: [],
      purchaseItems: [],
      stockMovements: [],
      unit: {
        id: 1,
        name: 'unit',
        factor: 1,
        ingredients: [],
        purchaseItems: [],
        stockMovements: [],
        recipeIngredient: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      lossFactor: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ];

  getEntity(): string {
    return this.entity;
  }

  getData(): Ingredient[] {
    return this.data;
  }
}
