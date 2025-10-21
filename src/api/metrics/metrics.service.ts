import {
  OrdersByDayResponseDTO,
  LinesByDayResponseDTO,
  GmvByDayResponseDTO,
  GmvByContactMethodResponseDTO,
  GmvByPaymentMethodResponseDTO,
  StockByDayResponseDTO,
} from '../models/DTO/response/ordersByDayResponseDTO';

export interface IMetricsService {
  getOrdersByDay(startDate?: string, endDate?: string): Promise<OrdersByDayResponseDTO[]>;
  getLinesByDay(startDate?: string, endDate?: string): Promise<LinesByDayResponseDTO[]>;
  getGmvByDay(startDate?: string, endDate?: string): Promise<GmvByDayResponseDTO[]>;
  getGmvByContactMethod(): Promise<GmvByContactMethodResponseDTO[]>;
  getGmvByPaymentMethod(): Promise<GmvByPaymentMethodResponseDTO[]>;
  getStockByDay(startDate?: string, endDate?: string, ingredientId?: number): Promise<StockByDayResponseDTO[]>;
}