import { OrderRequestDTO } from '../models/DTO/request/orderRequestDTO';
import { ComandaResponseDTO } from '../models/DTO/response/comandaResponseDTO';
import { OrderResponseDTO } from '../models/DTO/response/orderResponseDTO';
import { OrderSearchResponseDTO } from '../models/DTO/response/orderSearchResponseDTO';
import { KitchenOrderResponseDTO } from '../models/DTO/response/kitchenOrderResponseDTO';

export interface IOrderService {
  create(order: OrderRequestDTO): Promise<OrderResponseDTO>;
  getById(id: number): Promise<OrderResponseDTO>;
  update(id: number, order: OrderRequestDTO): Promise<OrderResponseDTO>;
  delete(id: number): Promise<OrderResponseDTO>;
  getOrdersByClientName(clientName: string, page?: number, limit?: number): Promise<OrderSearchResponseDTO>;
  getOrdersByState(stateId: number, page?: number, limit?: number): Promise<OrderSearchResponseDTO>;
  changeStateOrder(orderId: number, stateId: number): Promise<OrderResponseDTO>;
  getComanda(page: number, limit: number): Promise<ComandaResponseDTO>;
  getKitchenOrders(page: number, limit: number, productId?: number): Promise<KitchenOrderResponseDTO>;
}
