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
import logger from '../../config/logger';

/**
 * Interface for Order Service operations.
 * Defines the contract for order-related business logic.
 */
export interface IOrderService {
  /**
   * Creates a new order.
   * @param order - The order data to create.
   * @returns Promise resolving to the created order response DTO.
   */
  create(order: OrderRequestDTO): Promise<OrderResponseDTO>;

  /**
   * Retrieves an order by ID.
   * @param id - The unique identifier of the order.
   * @returns Promise resolving to the order response DTO.
   */
  getById(id: number): Promise<OrderResponseDTO>;

  /**
   * Updates an existing order.
   * @param id - The unique identifier of the order to update.
   * @param order - The updated order data.
   * @returns Promise resolving to the updated order response DTO.
   */
  update(id: number, order: OrderRequestDTO): Promise<OrderResponseDTO>;

  /**
   * Deletes an order by ID.
   * @param id - The unique identifier of the order to delete.
   * @returns Promise resolving to the deleted order response DTO.
   */
  delete(id: number): Promise<OrderResponseDTO>;

  /**
   * Retrieves orders by client name with pagination.
   * @param clientName - The name of the client.
   * @param page - The page number for pagination (default: 1).
   * @param limit - The number of results per page (default: 10).
   * @returns Promise resolving to the search results.
   */
  getOrdersByClientName(
    clientName: string,
    page?: number,
    limit?: number,
  ): Promise<OrderSearchResponseDTO>;

  /**
   * Retrieves orders by state with pagination.
   * @param stateId - The unique identifier of the state.
   * @param page - The page number for pagination (default: 1).
   * @param limit - The number of results per page (default: 10).
   * @returns Promise resolving to the search results.
   */
  getOrdersByState(
    stateId: number,
    page?: number,
    limit?: number,
  ): Promise<OrderSearchResponseDTO>;

  /**
   * Changes the state of an order.
   * @param orderId - The unique identifier of the order.
   * @param stateId - The new state identifier.
   * @returns Promise resolving to the updated order response DTO.
   */
  changeStateOrder(orderId: number, stateId: number): Promise<OrderResponseDTO>;

  /**
   * Retrieves the comanda (order list) with pagination.
   * @param page - The page number for pagination (default: 1).
   * @param limit - The number of results per page (default: 10).
   * @returns Promise resolving to the comanda response DTO.
   */
  getComanda(page: number, limit: number): Promise<ComandaResponseDTO>;

  /**
   * Retrieves kitchen orders with pagination.
   * @param page - The page number for pagination (default: 1).
   * @param limit - The number of results per page (default: 10).
   * @returns Promise resolving to the preparation response DTO.
   */
  getKitchenOrders(
    page: number,
    limit: number,
  ): Promise<PreparationResponseDTO>;
}

/**
 * Service class for handling order business logic.
 * Implements the IOrderService interface and follows SOLID principles:
 * - Single Responsibility: Handles only order-related operations.
 * - Dependency Inversion: Depends on abstractions (interfaces) rather than concretions.
 */
export class OrderService implements IOrderService {
  /**
   * Constructs a new OrderService instance.
   * @param _orderRepository - The repository for order data access.
   * @param _orderMapper - The mapper for transforming order data.
   * @param _lineService - The service for line operations (default: lineService).
   */
  constructor(
    private readonly _orderRepository: IOrderRepository,
    private readonly _orderMapper: OrderMapper,
    private readonly _lineService: ILineService = lineService,
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
