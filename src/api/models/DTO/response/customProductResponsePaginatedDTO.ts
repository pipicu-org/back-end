import { Product } from '../../entity';

export class CustomProductResponsePaginatedDTO {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  data: Array<{
    id: number;
    baseProductId: number;
    createdAt: Date;
    updatedAt: Date;
    baseProduct: {
      id: number;
      name: string;
      preTaxPrice: number;
      price: number;
      categoryId: number;
      category: {
        id: number;
        name: string;
      };
    };
    recipe: {
      id: number;
      ingredients: Array<{
        id: number;
        quantity: number;
        ingredient: {
          id: number;
          name: string;
        };
      }>;
    };
  }>;

  constructor(findAndCount: [Product[], number], page: number, limit: number) {
    this.total = findAndCount[1];
    this.page = page;
    this.limit = limit;
    this.totalPages = Math.ceil(this.total / limit);
    this.data = findAndCount[0].map((product: Product) => ({
      id: product.id,
      baseProductId: product.parentProductId || 0,
      recipe: product.recipe
        ? {
            id: product.recipe.id,
            ingredients: product.recipe.recipeIngredient.map((ri: any) => ({
              id: ri.id,
              quantity: ri.quantity,
              ingredient: {
                id: ri.ingredient.id,
                name: ri.ingredient.name,
              },
            })),
          }
        : { id: 0, ingredients: [] },
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      baseProduct: product.parentProduct
        ? {
            id: product.parentProduct.id,
            name: product.parentProduct.name,
            preTaxPrice: product.parentProduct.preTaxPrice,
            price: product.parentProduct.price,
            categoryId: product.parentProduct.categoryId,
            category: {
              id: product.parentProduct.category.id,
              name: product.parentProduct.category.name,
            },
          }
        : {
            id: 0,
            name: '',
            preTaxPrice: 0,
            price: 0,
            categoryId: 0,
            category: { id: 0, name: '' },
          },
    }));
  }
}
