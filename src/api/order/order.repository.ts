import { Repository } from 'typeorm';
import { Order, State, Transition, TransitionType } from '../models/entity';
import { OrderMapper } from '../models/mappers/orderMapper';
import { OrderSearchResponseDTO } from '../models/DTO/response/orderSearchResponseDTO';
import { OrderResponseDTO } from '../models/DTO/response/orderResponseDTO';
import { ComandaResponseDTO } from '../models/DTO/response/comandaResponseDTO';

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

  changeStateOrder(
    orderId: number,
    stateId: number,
  ): Promise<OrderResponseDTO | null>;

  getComanda(page?: number, limit?: number): Promise<ComandaResponseDTO | null>;
}

export class OrderRepository implements IOrderRepository {
  constructor(
    private readonly _dbOrderRepository: Repository<Order>,
    private readonly _dbStateRepository: Repository<State>,
    private readonly _dbTransitionRepository: Repository<Transition>,
    private readonly _dbTransitionTypeRepository: Repository<TransitionType>,
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
      const orders = await this._dbOrderRepository
        .createQueryBuilder('order')
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
      const order = await this._dbOrderRepository
        .createQueryBuilder('order')
        .innerJoinAndSelect('order.client', 'client')
        .innerJoinAndSelect('order.state', 'state')
        .innerJoinAndSelect('order.lines', 'line')
        .innerJoinAndSelect('line.preparation', 'preparation')
        .innerJoinAndSelect('line.product', 'product')
        .innerJoinAndSelect('preparation.state', 'preparationState')
        .where('order.id = :id', { id })
        .getOne();
      if (!order) return null;
      return this._orderMapper.orderToOrderResponseDTO(order);
    } catch (error) {
      console.error('Error fetching order by ID:', error);
      return null;
    }
  }

  async changeStateOrder(
    orderId: number,
    stateId: number,
  ): Promise<OrderResponseDTO | null> {
    try {
      const order = await this._dbOrderRepository
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.client', 'client')
        .leftJoinAndSelect('order.state', 'state')
        .leftJoinAndSelect('order.lines', 'line')
        .leftJoinAndSelect('line.preparation', 'preparation')
        .leftJoinAndSelect('line.product', 'product')
        .leftJoinAndSelect('preparation.state', 'preparationState')
        .where('order.id = :id', { id: orderId })
        .getOne();

      if (!order) {
        throw new Error(`Order with id ${orderId} not found`);
      }
      const state = await this._dbStateRepository.findOne({
        where: { id: stateId },
      });
      if (!state) {
        throw new Error(`State with id ${stateId} not found`);
      }
      order.state = state;
      const transitionType = await this._dbTransitionTypeRepository.findOne({
        where: { name: 'Order State Transition' },
      });
      if (!transitionType) {
        throw new Error('Transition type "Order State Transition" not found');
      }
      await this._dbTransitionRepository
        .createQueryBuilder('transition')
        .insert()
        .values({
          transitionType: transitionType,
          createdAt: new Date(),
          fromState: order.state,
          toState: state,
          transitionatorId: order.id,
          duration: Date.now() - order.createdAt.getTime(),
        })
        .execute();
      await this._dbOrderRepository.save(order);
      return this._orderMapper.orderToOrderResponseDTO(order);
    } catch (error) {
      console.error('Error changing order state:', error);
      return null;
    }
  }

  async getComanda(): Promise<ComandaResponseDTO | null> {
    try {
      const orders = await this._dbOrderRepository
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.client', 'client')
        .leftJoinAndSelect('order.state', 'state')
        .leftJoinAndSelect('order.lines', 'line')
        .leftJoinAndSelect('line.preparation', 'preparation')
        .leftJoinAndSelect('line.product', 'product')
        .where('state.id = :stateId', { stateId: 1 })
        .orderBy('order.createdAt', 'ASC')
        .getManyAndCount();
      return this._orderMapper.ordersToComandaResponseDTO(orders);
    } catch (error) {
      console.error('Error fetching comanda:', error);
      return null;
    }
  }

  async update(
    id: number,
    newOrder: Partial<Order>,
  ): Promise<OrderResponseDTO | null> {
    try {
      const existingOrder = await this.getById(id);
      if (!existingOrder) {
        console.error(`Order with id ${id} not found`);
        return null;
      }
      newOrder.id = id;
      await this._dbOrderRepository.save(newOrder);
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
