export interface ISearchOrdersResponseDTO {
  search: string;
  total: number;
  page: number;
  limit: number;
  data: Array<{
    id: string;
    name: string;
    horario: string;
    state: string;
    totalPrice: number;
  }>;
}

export class SearchOrdersResponseDTO implements ISearchOrdersResponseDTO {
  search: string;
  total: number;
  page: number;
  limit: number;
  data: Array<{
    id: string;
    name: string;
    horario: string;
    state: string;
    totalPrice: number;
  }>;

  constructor(
    search: string,
    total: number,
    page: number,
    limit: number,
    data: Array<{
      id: string;
      name: string;
      horario: string;
      state: string;
      totalPrice: number;
    }>,
  ) {
    this.search = search;
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.data = data;
  }
}
