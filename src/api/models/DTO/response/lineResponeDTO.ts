import { Line } from '../../entity';

export class LineResponseDTO {
  id: number;
  order: {
    id: number;
    clientName: string;
  };
  state: {
    id: number;
    name: string;
  };
  addedAt: string;
  product: {
    id: number;
    name: string;
    price: number;
  };
  quantity: number;
  totalPrice: number;
  constructor(line: Line) {
    this.id = line.id;
    this.order = {
      id: line.order.id,
      clientName: line.order.client.name,
    };
    this.state = {
      id: line.preparation.state.id,
      name: line.preparation.state.name,
    };
    this.addedAt = line.addedAt.toISOString();
    this.product = {
      id: line.product.id,
      name: line.product.name,
      price: line.product.price,
    };
    this.quantity = line.quantity;
    this.totalPrice = line.totalPrice;
  }
}
