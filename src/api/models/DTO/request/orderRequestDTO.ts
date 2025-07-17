import { Order } from '../../entity';

export class OrderRequestDTO {
  client: number;
  deliveryTime: string;
  paymentMethod: string;
  lines: Array<{
    product: number;
    quantity: number;
  }>;

  constructor(order: Order) {
    this.client = order.client.id;
    this.deliveryTime = order.deliveryTime.toISOString();
    this.paymentMethod = order.paymentMethod;
    this.lines = order.lines.map((line) => ({
      product: line.product.id,
      quantity: line.quantity,
    }));
  }
}
