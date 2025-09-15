import { lineService } from '../../config';
import { HttpError } from '../../errors/httpError';
import { ILineService } from '../line/line.service';
import { OrderRequestDTO } from '../models/DTO/request/orderRequestDTO';
import { ComandaResponseDTO } from '../models/DTO/response/comandaResponseDTO';
import { OrderResponseDTO } from '../models/DTO/response/orderResponseDTO';
import { OrderSearchResponseDTO } from '../models/DTO/response/orderSearchResponseDTO';
import { PreparationResponseDTO } from '../models/DTO/response/preparationResponseDTO';
import { OrderMapper } from '../models/mappers/orderMapper';
import { IOrderRepository } from './order.repository';

export interface IOrderService {
  create(order: OrderRequestDTO): Promise<OrderResponseDTO>;
  getById(id: number): Promise<OrderResponseDTO>;
  update(id: number, order: OrderRequestDTO): Promise<OrderResponseDTO>;
  delete(id: number): Promise<OrderResponseDTO>;
  getOrdersByClientName(
    clientName: string,
    page?: number,
    limit?: number,
  ): Promise<OrderSearchResponseDTO>;

  getOrdersByState(
    stateId: number,
    page?: number,
    limit?: number,
  ): Promise<OrderSearchResponseDTO>;
  changeStateOrder(orderId: number, stateId: number): Promise<OrderResponseDTO>;
  getComanda(page: number, limit: number): Promise<ComandaResponseDTO>;

  getKitchenOrders(
    page: number,
    limit: number,
  ): Promise<PreparationResponseDTO>;
}

export class OrderService implements IOrderService {
  constructor(
    private readonly _orderRepository: IOrderRepository,
    private readonly _orderMapper: OrderMapper,
    private readonly _lineService: ILineService = lineService,
  ) {}

  async create(orderRequest: OrderRequestDTO): Promise<OrderResponseDTO> {
    try {
      if (this._hasRepeatedProducts(orderRequest)) {
        throw new HttpError(400, 'Order contains repeated products');
      }
      const order =
        await this._orderMapper.orderRequestDTOToOrder(orderRequest);
      return await this._orderRepository.create(order);
    } catch (error: any) {
      console.error('Error creating order:', error);
      throw new HttpError(error.status, error.message);
    }
  }

  async getById(id: number): Promise<OrderResponseDTO> {
    try {
      return await this._orderRepository.getById(id);
    } catch (error) {
      console.error(`Error fetching order with id ${id}:`, error);
      throw error;
    }
  }

  async update(
    id: number,
    orderRequest: OrderRequestDTO,
  ): Promise<OrderResponseDTO> {
    try {
      if (this._hasRepeatedProducts(orderRequest)) {
        throw new HttpError(400, 'Order contains repeated products');
      }
      const existingOrder = await this._orderRepository.getById(id);
      if (!existingOrder) {
        throw new HttpError(404, `Order with id ${id} not found`);
      }
      const order =
        await this._orderMapper.orderRequestDTOToOrder(orderRequest);
      return await this._orderRepository.update(id, order);
    } catch (error) {
      console.error(`Error updating order with id ${id}:`, error);
      throw error;
    }
  }

  async delete(id: number): Promise<OrderResponseDTO> {
    try {
      return await this._orderRepository.delete(id);
    } catch (error) {
      console.error(`Error deleting order with id ${id}:`, error);
      throw error;
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

  async getOrdersByState(
    stateId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<OrderSearchResponseDTO> {
    try {
      return await this._orderRepository.getOrdersByState(stateId, page, limit);
    } catch (error) {
      console.error(`Error fetching orders for state ${stateId}:`, error);
      throw error;
    }
  }

  private async _isOrderAbleToChangeState(
    order: OrderResponseDTO,
    newState: number,
  ): Promise<boolean> {
    const lines = await this._lineService.getLinesByOrderId(Number(order.id));
    if (!lines || lines.length === 0) {
      throw new HttpError(404, `No lines found for order with id ${order.id}`);
    }
    return lines.every((line) => line.state.id === newState);
  }

  async changeStateOrder(
    orderId: number,
    stateId: number,
  ): Promise<OrderResponseDTO> {
    try {
      let order = await this._orderRepository.getById(orderId);
      if (!order) {
        throw new HttpError(404, `Order with id ${orderId} not found`);
      }
      if (!(await this._isOrderAbleToChangeState(order, stateId))) {
        throw new HttpError(
          400,
          'Order cannot change state due to line states mismatch',
        );
      }
      return await this._orderRepository.changeStateOrder(orderId, stateId);
    } catch (error) {
      console.error(
        `Error changing state for order with id ${orderId}: `,
        error,
      );
      throw error;
    }
  }

  async getComanda(
    page: number = 1,
    limit: number = 10,
  ): Promise<ComandaResponseDTO> {
    try {
      const orders = await this._orderRepository.getComanda(page, limit);
      return orders;
    } catch (error) {
      console.error('Error fetching comanda: ', error);
      throw error;
    }
  }

  async getKitchenOrders(
    page: number = 1,
    limit: number = 10,
  ): Promise<PreparationResponseDTO> {
    try {
      const orders = await this._orderRepository.getKitchenOrders(page, limit);
      return orders;
    } catch (error) {
      console.error('Error fetching kitchen orders: ', error);
      throw error;
    }
  }

  private _hasRepeatedProducts(order: OrderRequestDTO): boolean {
    const products = order.lines.map((line) => line.product);
    const uniqueProducts = new Set(products);
    return uniqueProducts.size !== products.length;
  }
}
