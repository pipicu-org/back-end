import { Product } from '../../entity/product';

export class ProductResponseDTO {
  id: number;
  name: string;
  preTaxPrice: number;
  price: number;
  recipeId: number | null;
  categoryId: number;
  createdAt: Date;
  updatedAt: Date;
  category: {
    id: number;
    name: string;
  };
  recipe?: {
    id: number;
    // totalPrice: number;
    ingredients: Array<{
      id: number;
      quantity: number;
      ingredient: {
        id: number;
        name: string;
        // price: number;
      };
    }>;
  };

  constructor(product: Product) {
    this.id = product.id;
    this.name = product.name;
    this.preTaxPrice = product.preTaxPrice;
    this.price = product.price;
    this.recipeId = product.recipeId;
    this.categoryId = product.categoryId;
    this.createdAt = product.createdAt;
    this.updatedAt = product.updatedAt;
    this.category = {
      id: product.category.id,
      name: product.category.name,
    };
    if (product.recipe) {
      this.recipe = {
        id: product.recipe.id,
        // totalPrice: product.recipe.totalPrice,
        ingredients: product.recipe.recipeIngredient.map((ingredientsList) => ({
          id: ingredientsList.id,
          quantity: ingredientsList.quantity,
          ingredient: {
            id: ingredientsList.ingredient.id,
            name: ingredientsList.ingredient.name,
            // price: ingredientsList.ingredient.price,
          },
        })),
      };
    }
  }
}
