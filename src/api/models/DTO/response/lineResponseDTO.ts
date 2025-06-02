import { Line } from '../../line';

interface ILineResponseDTO {
  id: number;
  order: {
    id: number;
    state: {
      id: number;
      name: string;
    };
    client: {
      id: number;
      phoneNumber: string;
      name: string;
      address: string;
    };
    createdAt: Date;
    Lines: {
      id: number;
      productId: number;
      quantity: number;
      price: number;
    }[];
  };
  quantity: number;
  totalPrice: number;
  addedAt: Date;
}

export class LineResponseDTO implements ILineResponseDTO {
  id: number;
  order: {
    id: number;
    state: {
      id: number;
      name: string;
    };
    client: {
      id: number;
      phoneNumber: string;
      name: string;
      address: string;
    };
    createdAt: Date;
    Lines: {
      id: number;
      productId: number;
      quantity: number;
      price: number;
    }[];
  };
  quantity: number;
  totalPrice: number;
  addedAt: Date;
  constructor(line: Line) {
    this.id = line.id;
    this.order = {
      id: line.order.id,
      state: {
        id: line.order.state.id,
        name: line.order.state.name,
      },
      client: {
        id: line.order.client.id,
        phoneNumber: line.order.client.phoneNumber,
        name: line.order.client.name,
        address: line.order.client.address,
      },
      createdAt: line.order.createdAt,
      Lines: line.order.lines.map((l) => ({
        id: l.id,
        productId: l.product.id,
        quantity: l.quantity,
        price: l.totalPrice,
      })),
    };
    this.quantity = line.quantity;
    this.totalPrice = line.totalPrice;
    this.addedAt = line.addedAt;
  }
}
