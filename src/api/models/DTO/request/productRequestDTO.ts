export interface IProductRequestDTO {
  category: string;
  name: string;
  stock: number;
  price: number;
  ingredients: Array<{
    name: string;
    quantity: number;
  }>;
}

export class ProductRequestDTO implements IProductRequestDTO {
  category: string;
  name: string;
  price: number;
  stock: number;
  ingredients: Array<{
    name: string;
    quantity: number;
  }>;

  constructor(
    category: string,
    name: string,
    price: number,
    stock: number,
    ingredients: Array<{ name: string; quantity: number }>,
  ) {
    this.category = category;
    this.name = name;
    this.price = price;
    this.stock = stock;
    this.ingredients = ingredients;
  }
}
