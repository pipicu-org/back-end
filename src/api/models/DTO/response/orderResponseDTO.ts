import { Order } from '../../entity/order';

export class OrderResponseDTO {
  id: string;
  state: string;
  client: string;
  phoneNumber: string;
  address: string;
  deliveryTime: string;
  contactMethod: string;
  paymentMethod: string;
  total: number;
  lines: Array<{
    id: string;
    product: {
      id: string;
      name: string;
    };
    productType: number;
    quantity: number;
    totalPrice: number;
  }>;

  constructor(order: Order) {
    this.id = order.id.toString();
    this.state = order.state.name;
    this.client = order.client.name;
    this.phoneNumber = order.client.phoneNumber;
    this.address = order.client.address;
    this.deliveryTime = order.deliveryTime.toISOString();
    this.contactMethod = order.contactMethod;
    this.paymentMethod = order.paymentMethod;
    this.total = order.total;
    this.lines = order.lines.map((line) => ({
      id: line.id.toString(),
      product: {
        id: line.product.id.toString(),
        name: line.product.name,
      },
      productType: line.productTypeId,
      quantity: line.quantity,
      totalPrice: line.product.price * line.quantity,
    }));
  }
}
