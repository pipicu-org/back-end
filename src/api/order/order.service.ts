import { OrderRequestDTO } from '../models/DTO/request/orderRequestDTO';
import { OrderResponseDTO } from '../models/DTO/response/orderResponseDTO';
import { IOrderRepository } from './order.repository';

export interface IOrderService {
  create(order: OrderRequestDTO): Promise<OrderResponseDTO>;
  get(id: number): Promise<OrderResponseDTO>;
  update(id: number, order: OrderRequestDTO): Promise<OrderResponseDTO>;
  delete(id: number): Promise<OrderResponseDTO>;
}

export class OrderService implements IOrderService {
  constructor(
    private readonly orderRepository: IOrderRepository,
  ) {}

  async create(order: OrderRequestDTO): Promise<OrderResponseDTO> {
    try {
      const createdOrder = await this.orderRepository.create(order);
      return new OrderResponseDTO(createdOrder);
    } catch (error) {
      console.error('Error en crear la orden:', error);
      throw new Error('No se ha podido crear la orden');
    }
  }

  async get(id: number): Promise<OrderResponseDTO> {
    try {
      const order = await this.orderRepository.get(id);
      if (!order) {
        throw new Error('Order not found');
      }
      return new OrderResponseDTO(order);
    } catch (error) {
      console.error('Error en encontrar la orden:', error);
      throw new Error('No se ha podido encontrar la orden');
    }
  }

  async update(id: number, order: OrderRequestDTO): Promise<OrderResponseDTO> {
    try {
      const updatedOrder = await this.orderRepository.update(id, order);
      if (!updatedOrder) {
        throw new Error('Orden no encontrada');
      }
      return new OrderResponseDTO(updatedOrder);
    } catch (error) {
      console.error('Error en actualizar la orden:', error);
      throw new Error('No se ha podido actualizar la orden');
    }
  }

  async delete(id: number): Promise<OrderResponseDTO> {
    try {
      const order = await this.orderRepository.delete(id);
      if (!order) {
        throw new Error('Orden no encontrada');
      }
      return new OrderResponseDTO(order);
    } catch (error) {
      console.error('Error en eliminar la orden:', error);
      throw new Error('No se ha podido eliminar la orden');
    }
  }
}
