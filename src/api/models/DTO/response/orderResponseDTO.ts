import { Order } from '../../order';

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
      recipe: {
        id: number;
        ingredient: {
          id: number;
          name: string;
          price: number;
        };
        quantity: number;
        totalPrice: number;
      }[];
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
      recipe: {
        id: number;
        ingredient: {
          id: number;
          name: string;
          price: number;
        };
        quantity: number;
        totalPrice: number;
      }[];
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
    this.lines = order.lines.map((line) => ({
      id: line.id,
      product: {
        id: line.product.id,
        name: line.product.name,
        price: line.product.price,
        recipe: line.product.recipes.map((recipe) => ({
          id: recipe.id,
          ingredient: {
            id: recipe.ingredient.id,
            name: recipe.ingredient.name,
            price: recipe.ingredient.price,
          },
          quantity: recipe.quantity,
          totalPrice: recipe.totalPrice,
        })),
      },
      quantity: line.quantity,
      totalPrice: line.totalPrice,
      addedAt: line.addedAt,
    }));
  }
}
