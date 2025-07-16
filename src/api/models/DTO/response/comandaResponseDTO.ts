export class ComandaResponseDTO {
  page: number;
  limit: number;
  total: number;
  data: {
    client: {
      id: string;
      name: string;
    };
    lines: {
      quantity: number;
      product: {
        id: string;
        name: string;
      };
    }[];
  }[];

  constructor(
    page: number,
    limit: number,
    total: number,
    data: {
      client: {
        id: string;
        name: string;
      };
      lines: {
        quantity: number;
        product: {
          id: string;
          name: string;
        };
      }[];
    }[],
  ) {
    this.page = page;
    this.limit = limit;
    this.total = total;
    this.data = data.map((order) => ({
      client: {
        id: order.client.id,
        name: order.client.name,
      },
      lines: order.lines.map((line) => ({
        quantity: line.quantity,
        product: {
          id: line.product.id,
          name: line.product.name,
        },
      })),
    }));
  }
}
