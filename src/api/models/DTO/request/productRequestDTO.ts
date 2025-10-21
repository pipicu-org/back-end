export class ProductRequestDTO {
  category: number;
  name: string;
  preTaxPrice: number;
  price: number;
  ingredients: Array<{
    id: number;
    quantity: number;
  }>;
  productTypeId?: number; // Optional for custom products
  parentProductId?: number; // Optional for custom products

  constructor(
    category: number,
    name: string,
    preTaxPrice: number,
    price: number,
    ingredients: Array<{ id: number; quantity: number }>,
    productTypeId?: number,
    parentProductId?: number,
  ) {
    this.category = category;
    this.name = name;
    this.preTaxPrice = preTaxPrice;
    this.price = price;
    this.ingredients = ingredients;
    this.productTypeId = productTypeId || 1;
    this.parentProductId = parentProductId;
  }
}
