import { Order } from '../../entity';

export interface IOrderRequestDTO {
  state: string;
  client: string;
  phone: string;
  address: string;
  deliveryTime: string;
  paymentMethod: string;
  lines: Array<{
    product: string;
    quantity: number;
  }>;
}

export class OrderRequestDTO implements IOrderRequestDTO {
  state: string;
  client: string;
  phone: string;
  address: string;
  deliveryTime: string;
  paymentMethod: string;
  lines: Array<{
    product: string;
    quantity: number;
  }>;

  constructor(order: Order) {
    this.state = order.state.name;
    this.client = order.client.name;
    this.phone = order.client.phoneNumber;
    this.address = order.client.address;
    this.deliveryTime = order.deliveryTime.toISOString();
    this.paymentMethod = order.paymentMethod;
    this.lines = order.lines.map((line) => ({
      product: line.product.name,
      quantity: line.quantity,
    }));
  }
}
