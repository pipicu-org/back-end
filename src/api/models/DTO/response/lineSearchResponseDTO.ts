export class LineSearchResponseDTO {
  total: number;
  page: number;
  limit: number;
  data: Array<{
    order: {
      id: string;
    };
    client: {
      id: string;
      name: string;
    };
    line: {
      id: string;
      quantity: number;
      product: {
        id: string;
        name: string;
      };
    };
    state: string;
  }>;

  constructor(
    total: number,
    page: number,
    limit: number,
    data: Array<{
      order: { id: string };
      client: { id: string; name: string };
      line: {
        id: string;
        quantity: number;
        product: { id: string; name: string };
      };
      state: string;
    }>,
  ) {
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.data = data;
  }
}
