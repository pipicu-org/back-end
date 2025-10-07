export class OrderSearchResponseDTO {
  search: string;
  total: number;
  page: number;
  limit: number;
  data: Array<{
    id: string;
    name: string;
    deliveryTime: string;
    state: string;
    total: number;
  }>;

  constructor(
    search: string,
    total: number,
    page: number,
    limit: number,
    data: Array<{
      id: string;
      name: string;
      deliveryTime: string;
      state: string;
      total: number;
    }>,
  ) {
    this.search = search;
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.data = data;
  }
}
