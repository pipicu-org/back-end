import { Order } from '../../entity';

export class PreparationResponseDTO {
  total: string;
  page: number;
  limit: number;
  data: {
    orders: Array<{
      id: number;
      client: {
        id: number;
        name: string;
      };
      lines: Array<{
        id: number;
        quantity: number;
        product: {
          id: number;
          name: string;
        };
      }>;
      state: {
        id: number;
        name: string;
      };
    }>;
  };

  constructor(orders: Order[], total: number, page: number, limit: number) {
    if (orders.length === 0) {
      this.total = '0';
      this.page = 1;
      this.limit = 10;
      this.data = {
        orders: [],
      };
      return;
    }
    this.total = total.toString();
    this.page = page;
    this.limit = limit;
    this.limit = 10;
    this.data = {
      orders: orders.map((order) => ({
        id: order.id,
        client: {
          id: order.client.id,
          name: order.client.name,
        },
        lines: order.lines.map((line) => ({
          id: line.id,
          quantity: line.quantity,
          product: {
            id: line.product.id,
            name: line.product.name,
          },
        })),
        state: {
          id: order.state.id,
          name: order.state.name,
        },
      })),
    };
  }
}
