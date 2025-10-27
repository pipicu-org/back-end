import {
  OrdersByDayResponseDTO,
  LinesByDayResponseDTO,
  GmvByDayResponseDTO,
  GrossProfitByDayResponseDTO,
  MarginByDayResponseDTO,
  MrgByDayResponseDTO,
  GmvByContactMethodResponseDTO,
  GmvByPaymentMethodResponseDTO,
  StockByDayResponseDTO,
} from '../models/DTO/response/ordersByDayResponseDTO';

export interface IMetricsService {
  getOrdersByDay(startDate?: string, endDate?: string): Promise<OrdersByDayResponseDTO[]>;
  getLinesByDay(startDate?: string, endDate?: string): Promise<LinesByDayResponseDTO[]>;
  getGmvByDay(startDate?: string, endDate?: string): Promise<GmvByDayResponseDTO[]>;
  getGrossProfitByDay(startDate?: string, endDate?: string): Promise<GrossProfitByDayResponseDTO[]>;
  getMarginByDay(startDate?: string, endDate?: string): Promise<MarginByDayResponseDTO[]>;
  getMrgByDay(startDate?: string, endDate?: string): Promise<MrgByDayResponseDTO[]>;
  getGmvByContactMethod(): Promise<GmvByContactMethodResponseDTO[]>;
  getGmvByPaymentMethod(): Promise<GmvByPaymentMethodResponseDTO[]>;
  getStockByDay(startDate?: string, endDate?: string, ingredientId?: number): Promise<StockByDayResponseDTO[]>;
}