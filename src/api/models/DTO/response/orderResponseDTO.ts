import { Order } from '../../order';
import { Recipe } from '../../recipe';

interface IOrderResponseDTO {
  id: number;
  state: {
    id: number;
    name: string;
  };
  client: {
    id: number;
    name: string;
    phone: string;
    address: string;
  };
  createdAt: Date;
  lines: {
    id: number;
    product: {
      id: number;
      name: string;
      price: number;
      ingredients: Recipe[];
    };
    quantity: number;
    totalPrice: number;
    addedAt: Date;
  }[];
}

export class OrderResponseDTO implements IOrderResponseDTO {
  id: number;
  state: {
    id: number;
    name: string;
  };
  client: {
    id: number;
    name: string;
    phone: string;
    address: string;
  };
  createdAt: Date;
  lines: {
    id: number;
    product: {
      id: number;
      name: string;
      price: number;
      ingredients: Recipe[];
    };
    quantity: number;
    totalPrice: number;
    addedAt: Date;
  }[];

  constructor(order: Order) {
    this.id = order.id;
    this.state = {
      id: order.state.id,
      name: order.state.name,
    };
    this.client = {
      id: order.client.id,
      name: order.client.name,
      phone: order.client.phoneNumber,
      address: order.client.address,
    };
    this.createdAt = order.createdAt;
    this.lines = order.Lines.map((line) => ({
      id: line.id,
      product: {
        id: line.product.id,
        name: line.product.name,
        price: line.product.price,
        ingredients: line.product.ingredients,
      },
      quantity: line.quantity,
      totalPrice: line.totalPrice,
      addedAt: line.addedAt,
    }));
  }
}
