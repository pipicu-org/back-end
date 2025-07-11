export class ProductRequestDTO {
  category: string;
  name: string;
  price: number;
  ingredients: Array<{
    name: string;
    quantity: number;
  }>;

  constructor(
    category: string,
    name: string,
    price: number,
    ingredients: Array<{ name: string; quantity: number }>,
  ) {
    this.category = category;
    this.name = name;
    this.price = price;
    this.ingredients = ingredients;
  }
}
