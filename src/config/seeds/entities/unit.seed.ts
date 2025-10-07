import { Unit } from '../../../api/models/entity';
import { ISeed } from '../ISeed';

export class UnitSeed implements ISeed<Unit> {
  static instance: UnitSeed;

  static getInstance(): UnitSeed {
    if (!UnitSeed.instance) {
      UnitSeed.instance = new UnitSeed();
    }
    return UnitSeed.instance;
  }

  entity: string = 'Unit';
  data: Unit[] = [
    {
      id: 1,
      name: 'kg',
      factor: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      ingredients: [],
      purchaseItems: [],
      stockMovements: [],
      recipeIngredient: [],
    },
    {
      id: 2,
      name: 'L',
      factor: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      ingredients: [],
      purchaseItems: [],
      stockMovements: [],
      recipeIngredient: [],
    },
    {
      id: 3,
      name: 'g',
      factor: 0.001,
      createdAt: new Date(),
      updatedAt: new Date(),
      ingredients: [],
      purchaseItems: [],
      stockMovements: [],
      recipeIngredient: [],
    },
    {
      id: 4,
      name: 'mL',
      factor: 0.001,
      createdAt: new Date(),
      updatedAt: new Date(),
      ingredients: [],
      purchaseItems: [],
      stockMovements: [],
      recipeIngredient: [],
    },
    {
      id: 5,
      name: 'pcs',
      factor: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      ingredients: [],
      purchaseItems: [],
      stockMovements: [],
      recipeIngredient: [],
    },
    {
      id: 6,
      name: 'oz',
      factor: 0.0283495,
      createdAt: new Date(),
      updatedAt: new Date(),
      ingredients: [],
      purchaseItems: [],
      stockMovements: [],
      recipeIngredient: [],
    },
  ];

  getEntity(): string {
    return this.entity;
  }

  getData(): Unit[] {
    return this.data;
  }
}
