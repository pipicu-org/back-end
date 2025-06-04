import { orderFactory } from '../../config';
import { OrderRequestDTO } from '../models/DTO/request/orderRequestDTO';
import { OrderResponseDTO } from '../models/DTO/response/orderResponseDTO';
import { IOrderRepository } from './order.repository';

export interface IOrderService {
  create(order: OrderRequestDTO): Promise<OrderResponseDTO>;
  get(id: number): Promise<OrderResponseDTO>;
  update(id: number, order: OrderRequestDTO): Promise<OrderResponseDTO>;
  delete(id: number): Promise<OrderResponseDTO>;
  getByClientId(clientId: number): Promise<OrderResponseDTO[]>;
}

export class OrderService implements IOrderService {
  constructor(private readonly orderRepository: IOrderRepository) {}
  async create(orderRequestDTO: OrderRequestDTO): Promise<OrderResponseDTO> {
    try {
      const newOrder =
        await orderFactory.createOrderFromRequestDTO(orderRequestDTO);
      const order = await this.orderRepository.create(newOrder);
      return new OrderResponseDTO(order);
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error('Failed to create order');
    }
  }

  async get(id: number): Promise<OrderResponseDTO> {
    try {
      const order = await this.orderRepository.getById(id);
      if (!order) {
        throw new Error(`Order with ID: ${id} not found`);
      }
      return new OrderResponseDTO(order);
    } catch (error) {
      console.error('Error fetching order:', error);
      throw new Error('Failed to fetch order');
    }
  }

  async update(
    id: number,
    orderRequestDTO: OrderRequestDTO,
  ): Promise<OrderResponseDTO> {
    try {
      const updatedOrder =
        await orderFactory.createOrderFromRequestDTO(orderRequestDTO);
      const order = await this.orderRepository.update(id, updatedOrder);
      if (!order) {
        throw new Error(`Order with ID: ${id} not found`);
      }
      return new OrderResponseDTO(order);
    } catch (error) {
      console.error('Error updating order:', error);
      throw new Error('Failed to update order');
    }
  }

  async delete(id: number): Promise<OrderResponseDTO> {
    try {
      const order = await this.orderRepository.delete(id);
      if (!order) {
        throw new Error(`Order with ID: ${id} not found`);
      }
      return new OrderResponseDTO(order);
    } catch (error) {
      console.error('Error deleting order:', error);
      throw new Error('Failed to delete order');
    }
  }

  async getByClientId(clientId: number): Promise<OrderResponseDTO[]> {
    try {
      const orders = await this.orderRepository.getOrdersByClientId(clientId);
      return orders.map((order) => new OrderResponseDTO(order));
    } catch (error) {
      console.error('Error fetching orders by client ID:', error);
      throw new Error('Failed to fetch orders by client ID');
    }
  }
}
