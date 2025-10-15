import { Order } from '../../entity';

export class OrderRequestDTO {
  client: number;
  deliveryTime: string;
  contactMethod: string;
  paymentMethod: string;
  lines: Array<{
    product: {
      id: number;
    };
    quantity: number;
    productType?: string;
  }>;

  constructor(order: Order) {
    this.client = order.client.id;
    this.deliveryTime = order.deliveryTime.toISOString();
    this.contactMethod = order.contactMethod;
    this.paymentMethod = order.paymentMethod;
    this.lines = order.lines.map((line) => ({
      product: {
        id: line.product.id,
      },
      quantity: line.quantity,
    }));
  }
}
