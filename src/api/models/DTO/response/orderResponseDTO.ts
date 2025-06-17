import { Order } from '../../order';

interface IOrderResponseDTO {
  id: string;
  state: string;
  client: string;
  phone: string;
  address: string;
  horarioEntrega: Date;
  paymentMethod: string;
  lines: Array<{
    product: string;
    quantity: number;
    note: string | null;
    totalPrice: number;
    preparation: {
      id: string;
      state: string;
    };
  }>;
}

export class OrderResponseDTO implements IOrderResponseDTO {
  id: string;
  state: string;
  client: string;
  phone: string;
  address: string;
  horarioEntrega: Date;
  paymentMethod: string;
  lines: Array<{
    product: string;
    quantity: number;
    note: string | null;
    totalPrice: number;
    preparation: {
      id: string;
      state: string;
    };
  }>;

  constructor(order: Order) {
    this.id = order.id.toString();
    this.state = order.state.name;
    this.client = order.client.name;
    this.phone = order.client.phoneNumber;
    this.address = order.client.address;
    this.horarioEntrega = order.deliveryTime;
    this.paymentMethod = order.paymentMethod;
    this.lines = order.lines.map((line) => ({
      product: line.product.name,
      quantity: line.quantity,
      note: line.note?.note ?? null,
      totalPrice: parseFloat(line.totalPrice.toFixed(2)),
      preparation: {
        id: line.preparation.id.toString(),
        state: line.preparation.state.name,
      },
    }));
  }
}
