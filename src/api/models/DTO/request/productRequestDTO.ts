export interface IProductRequestDTO {
  categoryId: number;
  name: string;
  stock: number;
  price: number;
  recipeId: number;
  familyId: number;
}

export class ProductRequestDTO implements IProductRequestDTO {
  categoryId: number;
  name: string;
  price: number;
  stock: number;
  recipeId: number;
  familyId: number;

  constructor(
    categoryId: number,
    name: string,
    price: number,
    recipeId: number,
    familyId: number,
    stock: number,
  ) {
    this.categoryId = categoryId;
    this.name = name;
    this.price = price;
    this.recipeId = recipeId;
    this.familyId = familyId;
    this.stock = stock;
  }
}
