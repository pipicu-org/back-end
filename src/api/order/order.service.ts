import { OrderRequestDTO } from '../models/DTO/request/orderRequestDTO';
import { OrderResponseDTO } from '../models/DTO/response/orderResponseDTO';
import { OrderSearchResponseDTO } from '../models/DTO/response/orderSearchResponseDTO';
import { Line, Order, Product } from '../models/entity';
import { OrderMapper } from '../models/mappers/orderMapper';
import { IOrderRepository } from './order.repository';

export interface IOrderService {
  create(order: OrderRequestDTO): Promise<OrderResponseDTO>;
  getById(id: number): Promise<OrderResponseDTO | null>;
  update(id: number, order: OrderRequestDTO): Promise<OrderResponseDTO | null>;
  delete(id: number): Promise<OrderResponseDTO | null>;
  getOrdersByClientName(
    clientName: string,
    page?: number,
    limit?: number,
  ): Promise<OrderSearchResponseDTO>;
}

export class OrderService implements IOrderService {
  constructor(
    private readonly _orderRepository: IOrderRepository,
    private readonly _orderMapper: OrderMapper,
  ) {}

  async create(orderRequest: OrderRequestDTO): Promise<OrderResponseDTO> {
    try {
      const order =
        await this._orderMapper.orderRequestDTOToOrder(orderRequest);
      return await this._orderRepository.create(order);
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error('Failed to create order');
    }
  }

  async getById(id: number): Promise<OrderResponseDTO | null> {
    try {
      return await this._orderRepository.getById(id);
    } catch (error) {
      console.error(`Error fetching order with id ${id}:`, error);
      throw new Error('Failed to fetch order');
    }
  }

  async update(
    id: number,
    orderRequest: OrderRequestDTO,
  ): Promise<OrderResponseDTO | null> {
    try {
      const order =
        await this._orderMapper.orderRequestDTOToOrder(orderRequest);
      return await this._orderRepository.update(id, order);
    } catch (error) {
      console.error(`Error updating order with id ${id}:`, error);
      throw new Error('Failed to update order');
    }
  }

  async delete(id: number): Promise<OrderResponseDTO | null> {
    try {
      return await this._orderRepository.delete(id);
    } catch (error) {
      console.error(`Error deleting order with id ${id}:`, error);
      throw new Error('Failed to delete order');
    }
  }

  async getOrdersByClientName(
    clientName: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<OrderSearchResponseDTO> {
    try {
      return await this._orderRepository.getOrdersByClientName(
        clientName,
        page,
        limit,
      );
    } catch (error) {
      console.error(`Error fetching orders for client ${clientName}:`, error);
      throw error;
    }
  }
}
