import { ProductType } from '../../../api/models/entity';
import { ISeed } from '../ISeed';

export class ProductTypeSeed implements ISeed<ProductType> {
  static instance: ProductTypeSeed;

  static getInstance(): ProductTypeSeed {
    if (!ProductTypeSeed.instance) {
      ProductTypeSeed.instance = new ProductTypeSeed();
    }
    return ProductTypeSeed.instance;
  }

  entity: string = 'ProductType';
  data: ProductType[] = [
    {
      id: 1,
      name: 'normal',
      createdAt: new Date(),
      updatedAt: new Date(),
      products: [],
    },
    {
      id: 2,
      name: 'custom',
      createdAt: new Date(),
      updatedAt: new Date(),
      products: [],
    },
  ];

  getEntity(): string {
    return this.entity;
  }

  getData(): ProductType[] {
    return this.data;
  }
}
