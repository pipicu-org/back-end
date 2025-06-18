import { Order } from '../../order';

interface IOrderResponseDTO {
  id: string;
  state: string;
  client: string;
  phone: string;
  address: string;
  deliveryTime: string;
  paymentMethod: string;
  totalPrice: number;
  lines: Array<{
    product: string;
    quantity: number;
    note: string | null;
    totalPrice: number;
    state: string;
  }>;
}

export class OrderResponseDTO implements IOrderResponseDTO {
  id: string;
  state: string;
  client: string;
  phone: string;
  address: string;
  deliveryTime: string;
  paymentMethod: string;
  totalPrice: number;
  lines: Array<{
    product: string;
    quantity: number;
    note: string | null;
    totalPrice: number;
    state: string;
  }>;

  constructor(order: Order) {
    this.id = order.id.toString();
    this.state = order.state.name;
    this.client = order.client.name;
    this.phone = order.client.phoneNumber;
    this.address = order.client.address;
    this.deliveryTime = order.deliveryTime.toISOString();
    this.paymentMethod = order.paymentMethod;
    this.totalPrice = parseFloat(order.totalPrice.toFixed(2));
    this.lines = order.lines.map((line) => ({
      product: line.product.name,
      quantity: line.quantity,
      note: line.note?.note ?? null,
      totalPrice: parseFloat(line.totalPrice.toFixed(2)),
      state: line.preparation.state.name,
    }));
  }
}
