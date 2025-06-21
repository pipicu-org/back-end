import { Product } from '../../product';

export interface IProductResponseDTO {
  id: number;
  name: string;
  price: number;
  stock: number;
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
}

export class ProductResponseDTO implements IProductResponseDTO {
  id: number;
  name: string;
  price: number;
  stock: number;
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
    this.stock = product.stock;
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
