import { ObjectLiteral } from 'typeorm';
import { getOrderRepository } from '../../config';
import { Order } from '../models';
import { OrderRequestDTO } from '../models/DTO/request/orderRequestDTO';

export interface IOrderRepository {
  create(order: OrderRequestDTO): Promise<Order>;

  get(id: number): Promise<ObjectLiteral | null>;

  update(id: number, newOrder: OrderRequestDTO): Promise<ObjectLiteral | null>;

  delete(id: number): Promise<Order | null>;
}

export class OrderRepositoryImpl implements IOrderRepository {
  async create(order: OrderRequestDTO): Promise<Order> {
    const OrderRepository = getOrderRepository();
    try {
      return OrderRepository.save(
        new Order(order.state, order.client, order.line),
      );
    } catch (error) {
      console.error('Error en la creacion de ordenes:', error);
      throw new Error('No se ha podido crear la orden');
    }
  }

  async get(id: number): Promise<ObjectLiteral | null> {
    const OrderRepository = getOrderRepository();
    try {
      const order = await OrderRepository.findOneBy({ id });
      return order;
    } catch (error) {
      console.error('Error al obtener la orden:', error);
      throw new Error('No se ha podido obtener la orden');
    }
  }

  async update(
    id: number,
    newOrder: OrderRequestDTO,
  ): Promise<ObjectLiteral | null> {
    const OrderRepository = getOrderRepository();
    try {
      await OrderRepository.update(
        id,
        new Order(newOrder.state, newOrder.client, newOrder.line),
      );
      const updatedOrder = await OrderRepository.findOneBy({ id });
      return updatedOrder;
    } catch (error) {
      console.error('Error al actualizar la orden:', error);
      throw new Error('No se ha podido actualizar la orden');
    }
  }

  async delete(id: number): Promise<Order | null> {
    const OrderRepository = getOrderRepository();
    try {
      const order = await this.get(id);
      await OrderRepository.delete(id);
      return order ? (order as Order) : null;
    } catch (error) {
      console.error('Error al eliminar la orden:', error);
      throw new Error('No se ha podido eliminar la orden');
    }
  }
}
