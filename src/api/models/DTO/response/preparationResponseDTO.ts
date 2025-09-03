import { Order } from '../../entity';

export class PreparationResponseDTO {
  order: {
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
  };

  constructor(order: Order) {
    this.order = {
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
    };
  }
}
