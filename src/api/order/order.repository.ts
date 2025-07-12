import { Like, Repository } from 'typeorm';
import { Order } from '../models/entity';
import { OrderMapper } from '../models/mappers/orderMapper';
import { OrderSearchResponseDTO } from '../models/DTO/response/orderSearchResponseDTO';
import { OrderResponseDTO } from '../models/DTO/response/orderResponseDTO';

export interface IOrderRepository {
  create(order: Partial<Order>): Promise<OrderResponseDTO>;

  getOrdersByClientName(
    clientName: string,
    page?: number,
    limit?: number,
  ): Promise<OrderSearchResponseDTO>;

  getById(id: number): Promise<OrderResponseDTO | null>;

  update(
    id: number,
    newOrder: Partial<Order>,
  ): Promise<OrderResponseDTO | null>;

  delete(id: number): Promise<OrderResponseDTO | null>;
}

export class OrderRepository implements IOrderRepository {
  constructor(
    private readonly _dbOrderRepository: Repository<Order>,
    private readonly _orderMapper: OrderMapper,
  ) {}

  async create(order: Partial<Order>): Promise<OrderResponseDTO> {
    try {
      const createdOrder = await this._dbOrderRepository.save(order);
      return this._orderMapper.orderToOrderResponseDTO(createdOrder);
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error('Failed to create order');
    }
  }

  async getOrdersByClientName(
    clientName: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<OrderSearchResponseDTO> {
    try {
      const orders = await this._dbOrderRepository.createQueryBuilder('order')
        .leftJoinAndSelect('order.client', 'client')
        .leftJoinAndSelect('order.state', 'state')
        .where('client.name LIKE :name', { name: `%${clientName}%` })
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();
      return this._orderMapper.ordersToOrderSearchResponseDTO(
        orders,
        clientName,
        page,
        limit,
      );
    } catch (error) {
      console.error('Error fetching orders by client name:', error);
      throw new Error('Failed to fetch orders by client name');
    }
  }

  async getById(id: number): Promise<OrderResponseDTO | null> {
    try {
      const order = await this._dbOrderRepository.findOne({
        where: { id },
        relations: ['client', 'state'],
      });
      if (!order) return null;
      return this._orderMapper.orderToOrderResponseDTO(order);
    } catch (error) {
      console.error('Error fetching order by ID:', error);
      return null;
    }
  }

  async update(
    id: number,
    newOrder: Partial<Order>,
  ): Promise<OrderResponseDTO | null> {
    try {
      await this._dbOrderRepository.update(id, newOrder);
      return await this.getById(id);
    } catch (error) {
      console.error('Error updating order:', error);
      return null;
    }
  }

  async delete(id: number): Promise<OrderResponseDTO | null> {
    try {
      const order = await this.getById(id);
      if (!order) return null;
      await this._dbOrderRepository.delete(id);
      return order;
    } catch (error) {
      console.error('Error deleting order:', error);
      return null;
    }
  }
}
