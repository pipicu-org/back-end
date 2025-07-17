export class ProductRequestDTO {
  category: number;
  name: string;
  price: number;
  ingredients: Array<{
    id: number;
    quantity: number;
    price: number;
  }>;

  constructor(
    category: number,
    name: string,
    price: number,
    ingredients: Array<{ id: number; quantity: number; price: number }>,
  ) {
    this.category = category;
    this.name = name;
    this.price = price;
    this.ingredients = ingredients;
  }
}
