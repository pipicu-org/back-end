import { Order } from '../../entity';

export class OrderRequestDTO {
  client: number;
  deliveryTime: string;
  paymentMethod: string;
  lines: Array<{
    product: number;
    quantity: number;
    personalizations: Array<{
      ingredient: number;
      quantity: number;
      note: string;
    }>;
  }>;

  constructor(order: Order) {
    this.client = order.client.id;
    this.deliveryTime = order.deliveryTime.toISOString();
    this.paymentMethod = order.paymentMethod;
    this.lines = order.lines.map((line) => ({
      product: line.product.id,
      quantity: line.quantity,
      personalizations:
        line.personalizations?.map((productPersonalization) => ({
          ingredient: productPersonalization.personalization.ingredient.id,
          quantity: productPersonalization.personalization.quantity,
          note: productPersonalization.personalization.note,
        })) || [],
    }));
  }
}
