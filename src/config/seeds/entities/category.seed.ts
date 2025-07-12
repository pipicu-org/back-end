import { Category } from '../../../api/models/entity';
import { ISeed } from '../ISeed';

export class CategorySeed implements ISeed<Category> {
    static instance: CategorySeed;

    static getInstance(): CategorySeed {
        if (!CategorySeed.instance) {
            CategorySeed.instance = new CategorySeed();
        }
        return CategorySeed.instance;
    }

    entity: string = 'Category';
    data: Category[] = [
        {
            id: 1,
            name: 'Hamburguesas',
            products: [],
        },
        {
            id: 2,
            name: 'Comandas',
            products: [],
        },
    ];

    getEntity(): string { return this.entity; };

    getData(): Category[] { return this.data; };
}
