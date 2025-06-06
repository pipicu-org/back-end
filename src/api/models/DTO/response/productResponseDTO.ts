import { Product } from '../../product';

export interface IProductResponseDTO {
  id: number;
  category: {
    id: number;
    name: string;
  };
  name: string;
  price: number;
  recipes: {
    id: number;
    ingredient: {
      id: number;
      name: string;
      price: number;
    };
    quantity: number;
    totalPrice: number;
  }[];
}

export class ProductResponseDTO implements IProductResponseDTO {
  id: number;
  category: {
    id: number;
    name: string;
  };
  name: string;
  price: number;
  recipes: {
    id: number;
    ingredient: {
      id: number;
      name: string;
      price: number;
    };
    quantity: number;
    totalPrice: number;
  }[];

  constructor(product: Product) {
    this.id = product.id;
    this.category = {
      id: product.category.id,
      name: product.category.name,
    };
    this.name = product.name;
    this.price = product.price;
    this.recipes = product.recipes.map((recipe) => ({
      id: recipe.id,
      ingredient: {
        id: recipe.ingredient.id,
        name: recipe.ingredient.name,
        price: recipe.ingredient.price,
      },
      quantity: recipe.quantity,
      totalPrice: recipe.totalPrice,
    }));
  }
}
