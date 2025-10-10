import { Product } from '../../entity';

export class ProductSearchResponseDTO {
  search: string;
  total: number;
  page: number;
  limit: number;
  data: Array<{
    id: string;
    name: string;
    category: string;
    preTaxPrice: number;
    price: number;
    maxPrepareable: number;
    cost: number;
  }>;

  constructor(
    findAndCount: [Product[], number],
    search: string,
    page: number,
    limit: number,
  ) {
    this.search = search;
    this.total = findAndCount[1];
    this.page = page;
    this.limit = limit;
    this.data = findAndCount[0].map((product) => ({
      id: product.id.toString(),
      name: product.name,
      category: product.category.name,
      preTaxPrice: product.preTaxPrice,
      price: product.price,
      maxPrepareable: product.maxPrepareable,
      cost: product.cost
    }));
  }
}
