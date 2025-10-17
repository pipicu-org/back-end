import { CustomProduct } from '../../entity';

export class CustomProductResponsePaginatedDTO {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  data: Array<{
    id: number;
    baseProductId: number;
    recipeId: number;
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

  constructor(
    findAndCount: [CustomProduct[], number],
    page: number,
    limit: number,
  ) {
    this.total = findAndCount[1];
    this.page = page;
    this.limit = limit;
    this.totalPages = Math.ceil(this.total / limit);
    this.data = findAndCount[0].map((customProduct) => ({
      id: customProduct.id,
      baseProductId: customProduct.baseProductId,
      recipeId: customProduct.recipeId,
      createdAt: customProduct.createdAt,
      updatedAt: customProduct.updatedAt,
      baseProduct: {
        id: customProduct.baseProduct.id,
        name: customProduct.baseProduct.name,
        preTaxPrice: customProduct.baseProduct.preTaxPrice,
        price: customProduct.baseProduct.price,
        categoryId: customProduct.baseProduct.categoryId,
        category: {
          id: customProduct.baseProduct.category.id,
          name: customProduct.baseProduct.category.name,
        },
      },
      recipe: {
        id: customProduct.recipe.id,
        ingredients: customProduct.recipe.recipeIngredient.map((ri) => ({
          id: ri.id,
          quantity: ri.quantity,
          ingredient: {
            id: ri.ingredient.id,
            name: ri.ingredient.name,
          },
        })),
      },
    }));
  }
}
