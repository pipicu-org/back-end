import { Order } from '../../entity';

export class OrderRequestDTO {
  client: string;
  deliveryTime: string;
  paymentMethod: string;
  lines: Array<{
    product: string;
    quantity: number;
  }>;

  constructor(order: Order) {
    this.client = order.client.name;
    this.deliveryTime = order.deliveryTime.toISOString();
    this.paymentMethod = order.paymentMethod;
    this.lines = order.lines.map((line) => ({
      product: line.product.name,
      quantity: line.quantity,
    }));
  }
}
