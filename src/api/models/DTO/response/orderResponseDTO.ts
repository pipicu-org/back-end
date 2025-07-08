import { Order } from '../../entity/order';

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
    id: string;
    product: string;
    quantity: number;
    totalPrice: number;
    state: string;
    note: Array<{
      id: string;
      description: string;
      ingredient: string;
      quantity: number;
    }> | null;
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
    id: string;
    product: string;
    quantity: number;
    totalPrice: number;
    state: string;
    note: Array<{
      id: string;
      description: string;
      ingredient: string;
      quantity: number;
    }> | null;
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
      id: line.id.toString(),
      product: line.product.name,
      quantity: line.quantity,
      totalPrice: parseFloat(line.totalPrice.toFixed(2)),
      state: line.preparation.state.name,
      note: line.note
        ? line.note.map((note) => ({
            id: note.id.toString(),
            description: note.description,
            ingredient: note.ingredient.name,
            quantity: note.quantity,
          }))
        : null,
    }));
  }
}
