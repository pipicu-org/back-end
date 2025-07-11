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
    totalPrice: number;
    ingredients: Array<{
      id: number;
      name: string;
      quantity: number;
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
      totalPrice: product.recipe.totalPrice,
      ingredients: product.recipe.ingredients.map((ingredient) => ({
        id: ingredient.id,
        name: ingredient.name,
        quantity: ingredient.quantity,
      })),
    };
  }
}
