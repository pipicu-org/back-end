import { Repository } from 'typeorm';
import { Order } from '../models';

export interface IOrderRepository {
  create(order: Partial<Order>): Promise<Order>;

  get(id: number): Promise<Order | null>;

  update(id: number, newOrder: Partial<Order>): Promise<Order | null>;

  delete(id: number): Promise<Order | null>;
}

export class OrderRepository implements IOrderRepository {
  constructor(
    private readonly order: Repository<Order>
  ) {}

  async create(order: Partial<Order>): Promise<Order> {
    try {
      if (!order.state) throw new Error("State should be defined");
      if (!order.client) throw new Error("Client should be defined");
      if (!order.lines) throw new Error("Lines should be defined");
      return this.order.save(
        new Order(order.state, order.client, order.lines),
      );
    } catch (error) {
      console.error('Error en la creacion de ordenes:', error);
      throw new Error('No se ha podido crear la orden');
    }
  }

  async get(id: number): Promise<Order | null> {
    try {
      const order = await this.order.findOneBy({ id });
      return order;
    } catch (error) {
      console.error('Error al obtener la orden:', error);
      throw new Error('No se ha podido obtener la orden');
    }
  }

  async update(
    id: number,
    newOrder: Partial<Order>,
  ): Promise<Order | null> {
    try {
      if (!newOrder.state) throw new Error("State should be defined");
      if (!newOrder.client) throw new Error("Client should be defined");
      if (!newOrder.lines) throw new Error("Lines should be defined");
      await this.order.update(
        id,
        new Order(newOrder.state, newOrder.client, newOrder.lines),
      );
      const updatedOrder = await this.order.findOneBy({ id });
      return updatedOrder;
    } catch (error) {
      console.error('Error al actualizar la orden:', error);
      throw new Error('No se ha podido actualizar la orden');
    }
  }

  async delete(id: number): Promise<Order | null> {
    try {
      const order = await this.get(id);
      await this.order.delete(id);
      return order ? (order as Order) : null;
    } catch (error) {
      console.error('Error al eliminar la orden:', error);
      throw new Error('No se ha podido eliminar la orden');
    }
  }
}
