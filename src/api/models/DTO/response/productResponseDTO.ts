import { Product } from '../../entity/product';

export class ProductResponseDTO {
  id: number;
  name: string;
  price: number;
  category: {
    id: number;
    name: string;
  };
  recipe: {
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
    this.price = product.price;
    this.category = {
      id: product.category.id,
      name: product.category.name,
    };
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
