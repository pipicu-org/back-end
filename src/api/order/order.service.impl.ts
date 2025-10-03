import { HttpError } from '../../errors/httpError';
import { ILineService } from '../line/line.service';
import { OrderRequestDTO } from '../models/DTO/request/orderRequestDTO';
import { ComandaResponseDTO } from '../models/DTO/response/comandaResponseDTO';
import { OrderResponseDTO } from '../models/DTO/response/orderResponseDTO';
import { OrderSearchResponseDTO } from '../models/DTO/response/orderSearchResponseDTO';
import { PreparationResponseDTO } from '../models/DTO/response/preparationResponseDTO';
import { OrderMapper } from '../models/mappers/orderMapper';
import { IOrderRepository } from './order.repository';
import { IOrderService } from './order.service';

export class OrderService implements IOrderService {
  constructor(
    private readonly _orderRepository: IOrderRepository,
    private readonly _orderMapper: OrderMapper,
    private readonly _lineService: ILineService,
  ) {}

  async create(orderRequest: OrderRequestDTO): Promise<OrderResponseDTO> {
    if (this._hasRepeatedProducts(orderRequest)) {
      throw new HttpError(400, 'Order contains repeated products');
    }
    const order =
      await this._orderMapper.orderRequestDTOToOrder(orderRequest);
    return await this._orderRepository.create(order);
  }

  async getById(id: number): Promise<OrderResponseDTO> {
    return await this._orderRepository.getById(id);
  }

  async update(
    id: number,
    orderRequest: OrderRequestDTO,
  ): Promise<OrderResponseDTO> {
    if (this._hasRepeatedProducts(orderRequest)) {
      throw new HttpError(400, 'Order contains repeated products');
    }
    const order =
      await this._orderMapper.orderRequestDTOToOrder(orderRequest);
    return await this._orderRepository.update(id, order);
  }

  async delete(id: number): Promise<OrderResponseDTO> {
    return await this._orderRepository.delete(id);
  }

  async getOrdersByClientName(
    clientName: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<OrderSearchResponseDTO> {
    return await this._orderRepository.getOrdersByClientName(
      clientName,
      page,
      limit,
    );
  }

  async getOrdersByState(
    stateId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<OrderSearchResponseDTO> {
    return await this._orderRepository.getOrdersByState(stateId, page, limit);
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
    const order = await this._orderRepository.getById(orderId);
    if (!order) {
      throw new HttpError(404, `Order with id ${orderId} not found`);
    }
    // if (!(await this._isOrderAbleToChangeState(order, stateId))) {
    //   throw new HttpError(
    //     400,
    //     'Order cannot change state due to line states mismatch',
    //   );
    // }
    return await this._orderRepository.changeStateOrder(orderId, stateId);
  }

  async getComanda(
    page: number = 1,
    limit: number = 10,
  ): Promise<ComandaResponseDTO> {
    return await this._orderRepository.getComanda(page, limit);
  }

  async getKitchenOrders(
    page: number = 1,
    limit: number = 10,
  ): Promise<PreparationResponseDTO> {
    return await this._orderRepository.getKitchenOrders(page, limit);
  }

  private _hasRepeatedProducts(order: OrderRequestDTO): boolean {
    const products = order.lines.map((line) => line.product);
    const uniqueProducts = new Set(products);
    return uniqueProducts.size !== products.length;
  }
}