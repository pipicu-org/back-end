export interface IProductRequestDTO {
  categoryId: number;
  name: string;
  price: number;
  recipesId: number[];
}

export class ProductRequestDTO implements IProductRequestDTO {
  categoryId: number;
  name: string;
  price: number;
  recipesId: number[];

  constructor(
    categoryId: number,
    name: string,
    price: number,
    recipesId: number[],
  ) {
    this.categoryId = categoryId;
    this.name = name;
    this.price = price;
    this.recipesId = recipesId;
  }
}
