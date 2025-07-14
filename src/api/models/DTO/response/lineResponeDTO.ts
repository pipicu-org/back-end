import { Line } from '../../entity';

export class LineResponseDTO {
  id: number;
  order: {
    id: number;
    clientName: string;
  };
  state: string;
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
    this.state = line.preparation.state.name;
    this.addedAt = line.addedAt.toISOString();
    this.product = {
      id: line.product.id,
      name: line.product.name,
      price: parseFloat(line.product.price.toFixed(2)),
    };
    this.quantity = parseFloat(line.quantity.toFixed(2));
    this.totalPrice = parseFloat(line.totalPrice.toFixed(2));
  }
}
