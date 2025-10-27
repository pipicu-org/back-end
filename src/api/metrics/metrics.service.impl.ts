import { MetricsRepository } from './metrics.repository';
import { IMetricsService } from './metrics.service';
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
import { HttpError } from '../../errors/httpError';

export class MetricsServiceImpl implements IMetricsService {
  constructor(private metricsRepository: MetricsRepository) {}

  private validateDateRange(startDate?: string, endDate?: string): void {
    if (startDate && !this.isValidDate(startDate)) {
      throw new HttpError(400, 'Invalid startDate format. Use YYYY-MM-DD');
    }
    if (endDate && !this.isValidDate(endDate)) {
      throw new HttpError(400, 'Invalid endDate format. Use YYYY-MM-DD');
    }
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      throw new HttpError(400, 'startDate cannot be after endDate');
    }
  }

  private isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime()) && dateString.match(/^\d{4}-\d{2}-\d{2}$/) !== null;
  }

  async getOrdersByDay(startDate?: string, endDate?: string): Promise<OrdersByDayResponseDTO[]> {
    this.validateDateRange(startDate, endDate);
    return await this.metricsRepository.getOrdersByDay(startDate, endDate);
  }

  async getLinesByDay(startDate?: string, endDate?: string): Promise<LinesByDayResponseDTO[]> {
    this.validateDateRange(startDate, endDate);
    return await this.metricsRepository.getLinesByDay(startDate, endDate);
  }

  async getGmvByDay(startDate?: string, endDate?: string): Promise<GmvByDayResponseDTO[]> {
    this.validateDateRange(startDate, endDate);
    return await this.metricsRepository.getGmvByDay(startDate, endDate);
  }

  async getGrossProfitByDay(startDate?: string, endDate?: string): Promise<GrossProfitByDayResponseDTO[]> {
    this.validateDateRange(startDate, endDate);
    return await this.metricsRepository.getGrossProfitByDay(startDate, endDate);
  }

  async getMarginByDay(startDate?: string, endDate?: string): Promise<MarginByDayResponseDTO[]> {
    this.validateDateRange(startDate, endDate);
    return await this.metricsRepository.getMarginByDay(startDate, endDate);
  }

  async getMrgByDay(startDate?: string, endDate?: string): Promise<MrgByDayResponseDTO[]> {
    this.validateDateRange(startDate, endDate);
    return await this.metricsRepository.getMrgByDay(startDate, endDate);
  }

  async getGmvByContactMethod(): Promise<GmvByContactMethodResponseDTO[]> {
    return await this.metricsRepository.getGmvByContactMethod();
  }

  async getGmvByPaymentMethod(): Promise<GmvByPaymentMethodResponseDTO[]> {
    return await this.metricsRepository.getGmvByPaymentMethod();
  }

  async getStockByDay(startDate?: string, endDate?: string, ingredientId?: number): Promise<StockByDayResponseDTO[]> {
    this.validateDateRange(startDate, endDate);

    if (ingredientId && (isNaN(ingredientId) || ingredientId <= 0)) {
      throw new HttpError(400, 'Invalid ingredientId. Must be a positive integer');
    }

    return await this.metricsRepository.getStockByDay(startDate, endDate, ingredientId);
  }
}