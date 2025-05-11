import { Order } from "./entities";

export interface IOrderService {
  create(order: Order): Promise<Order>;
  get(id: string): Promise<Order[]>;
  update(id: string, order: Partial<Order>): Promise<Order>;
  delete(id: string): Promise<Order>;
}

export class OrderService implements IOrderService {
  constructor(
    // private readonly orderRepository: OrderRepository,
  ) { }

  async create(order: Order): Promise<Order> {
    return order;
  }

  async get(id: string): Promise<Order[]> {
    throw [
      {
        id: "1",
        lines: [],
        createdAt: new Date(),
      }
    ];
  }

  async update(id: string, order: Partial<Order>): Promise<Order> {
    return {
      id,
      createdAt: new Date(),
      lines: [],
      ...order
    };
  }

  async delete(id: string): Promise<Order> {
    return {
      id: "1",
      lines: [],
      createdAt: new Date(),
    };
  }
}
