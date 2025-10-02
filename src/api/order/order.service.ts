export interface IOrderService {
  create(order: import('../models/DTO/request/orderRequestDTO').OrderRequestDTO): Promise<import('../models/DTO/response/orderResponseDTO').OrderResponseDTO>;
  getById(id: number): Promise<import('../models/DTO/response/orderResponseDTO').OrderResponseDTO>;
  update(id: number, order: import('../models/DTO/request/orderRequestDTO').OrderRequestDTO): Promise<import('../models/DTO/response/orderResponseDTO').OrderResponseDTO>;
  delete(id: number): Promise<import('../models/DTO/response/orderResponseDTO').OrderResponseDTO>;
  getOrdersByClientName(clientName: string, page?: number, limit?: number): Promise<import('../models/DTO/response/orderSearchResponseDTO').OrderSearchResponseDTO>;
  getOrdersByState(stateId: number, page?: number, limit?: number): Promise<import('../models/DTO/response/orderSearchResponseDTO').OrderSearchResponseDTO>;
  changeStateOrder(orderId: number, stateId: number): Promise<import('../models/DTO/response/orderResponseDTO').OrderResponseDTO>;
  getComanda(page: number, limit: number): Promise<import('../models/DTO/response/comandaResponseDTO').ComandaResponseDTO>;
  getKitchenOrders(page: number, limit: number): Promise<import('../models/DTO/response/preparationResponseDTO').PreparationResponseDTO>;
}
