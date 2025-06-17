import { Repository } from 'typeorm';
import { Order } from '../models';

export interface IOrderRepository {
  create(order: Partial<Order>): Promise<Order>;

  getById(id: number): Promise<Order | null>;

  update(id: number, newOrder: Partial<Order>): Promise<Order | null>;

  delete(id: number): Promise<Order | null>;

  getTotalPriceById(id: number): Promise<number | null>;
  getOrdersByClientId(clientId: number): Promise<Order[]>;
}

export class OrderRepository implements IOrderRepository {
  constructor(private readonly order: Repository<Order>) {}

  async create(order: Partial<Order>): Promise<Order> {
    try {
      if (!order.state) throw new Error('State should be defined');
      if (!order.client) throw new Error('Client should be defined');
      if (!order.lines) throw new Error('Lines should be defined');
      const newOrder = new Order();
      newOrder.state = order.state;
      newOrder.client = order.client;
      newOrder.lines = order.lines;
      newOrder.horarioEntrega = order.horarioEntrega
        ? new Date(order.horarioEntrega)
        : new Date(Date.now() + 30 * 60 * 1000);
      newOrder.paymentMethod = order.paymentMethod ?? 'Efectivo';
      return this.order.save(newOrder);
    } catch (error) {
      console.error('Error en la creacion de ordenes:', error);
      throw new Error('No se ha podido crear la orden');
    }
  }

  async getById(id: number): Promise<Order | null> {
    try {
      const order = await this.order.findOneBy({ id });
      return order;
    } catch (error) {
      console.error('Error al obtener la orden:', error);
      throw new Error('No se ha podido obtener la orden');
    }
  }

  async update(id: number, newOrder: Partial<Order>): Promise<Order | null> {
    try {
      if (!newOrder.state) throw new Error('State should be defined');
      if (!newOrder.client) throw new Error('Client should be defined');
      if (!newOrder.lines) throw new Error('Lines should be defined');
      await this.order.update(id, newOrder);
      const updatedOrder = await this.order.findOneBy({ id });
      return updatedOrder;
    } catch (error) {
      console.error('Error al actualizar la orden:', error);
      throw new Error('No se ha podido actualizar la orden');
    }
  }

  async delete(id: number): Promise<Order | null> {
    try {
      const order = await this.getById(id);
      await this.order.delete(id);
      return order ?? null;
    } catch (error) {
      console.error('Error al eliminar la orden:', error);
      throw new Error('No se ha podido eliminar la orden');
    }
  }

  async getTotalPriceById(id: number): Promise<number | null> {
    try {
      const order = await this.getById(id);
      if (!order) return null;
      return order.lines.reduce((total, line) => total + line.totalPrice, 0);
    } catch (error) {
      console.error('Error al obtener el precio total de la orden:', error);
      throw new Error('No se ha podido obtener el precio total de la orden');
    }
  }

  async getOrdersByClientId(clientId: number): Promise<Order[]> {
    try {
      const orders = await this.order.find({
        where: { client: { id: clientId } },
        relations: ['lines', 'state'],
      });
      return orders;
    } catch (error) {
      console.error('Error al obtener las ordenes por clientId:', error);
      throw new Error('No se han podido obtener las ordenes por clientId');
    }
  }
}
