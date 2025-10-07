export class ProductRequestDTO {
  category: number;
  name: string;
  preTaxPrice: number;
  price: number;
  ingredients: Array<{
    id: number;
    quantity: number;
  }>;

  constructor(
    category: number,
    name: string,
    preTaxPrice: number,
    price: number,
    ingredients: Array<{ id: number; quantity: number }>,
  ) {
    this.category = category;
    this.name = name;
    this.preTaxPrice = preTaxPrice;
    this.price = price;
    this.ingredients = ingredients;
  }
}
