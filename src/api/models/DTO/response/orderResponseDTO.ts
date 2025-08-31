import { Order } from '../../entity/order';

export class OrderResponseDTO {
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
    personalization: Array<{
      id: string;
      quantity: number;
      ingredient: string;
      note: string;
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
    this.totalPrice = order.totalPrice;
    this.lines = order.lines.map((line) => ({
      id: line.id.toString(),
      product: line.product.name,
      quantity: line.quantity,
      totalPrice: line.product.price * line.quantity,
      state: line.preparation.state.name,
      personalization: line.personalizations
        ? line.personalizations.map((item) => ({
            id: item.id.toString(),
            quantity: item.personalization.quantity,
            ingredient: item.personalization.ingredient.name,
            note: item.personalization.note,
          }))
        : null,
    }));
  }
}
