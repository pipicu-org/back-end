interface IProductSearchDTO {
  search: string;
  total: number;
  page: number;
  limit: number;
  data: Array<{
    id: string;
    name: string;
    category: string;
    family: string;
    stock: number;
    price: number;
  }>;
}

export class ProductSearchDTO implements IProductSearchDTO {
  search: string;
  total: number;
  page: number;
  limit: number;
  data: Array<{
    id: string;
    name: string;
    category: string;
    family: string;
    stock: number;
    price: number;
  }>;

  constructor(
    search: string,
    total: number,
    page: number,
    limit: number,
    data: Array<{
      id: string;
      name: string;
      category: string;
      family: string;
      stock: number;
      price: number;
    }>,
  ) {
    this.search = search;
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.data = data.map((product) => ({
      ...product,
      stock: product.stock,
      price: product.price,
    }));
  }
}
