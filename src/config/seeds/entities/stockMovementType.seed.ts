import { StockMovementType } from '../../../api/models/entity';
import { ISeed } from '../ISeed';

export class StockMovementTypeSeed implements ISeed<StockMovementType> {
  static instance: StockMovementTypeSeed;

  static getInstance(): StockMovementTypeSeed {
    if (!StockMovementTypeSeed.instance) {
      StockMovementTypeSeed.instance = new StockMovementTypeSeed();
    }
    return StockMovementTypeSeed.instance;
  }

  entity: string = 'StockMovementType';
  data: StockMovementType[] = [
    {
      id: 1,
      name: 'Buy',
      createdAt: new Date(),
      updatedAt: new Date(),
      stockMovements: [],
    },
    {
      id: 2,
      name: 'Sell',
      createdAt: new Date(),
      updatedAt: new Date(),
      stockMovements: [],
    },
  ];

  getEntity(): string {
    return this.entity;
  }

  getData(): StockMovementType[] {
    return this.data;
  }
}
