import { Request, Response, NextFunction } from 'express';
import { IMetricsService } from './metrics.service';

export class MetricsController {
  constructor(private metricsService: IMetricsService) {}

  async getOrdersByDay(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { startDate, endDate } = req.query;
      const result = await this.metricsService.getOrdersByDay(
        startDate as string,
        endDate as string
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getLinesByDay(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { startDate, endDate } = req.query;
      const result = await this.metricsService.getLinesByDay(
        startDate as string,
        endDate as string
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getGmvByDay(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { startDate, endDate } = req.query;
      const result = await this.metricsService.getGmvByDay(
        startDate as string,
        endDate as string
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getGmvByContactMethod(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.metricsService.getGmvByContactMethod();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getGmvByPaymentMethod(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.metricsService.getGmvByPaymentMethod();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getStockByDay(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { startDate, endDate, ingredientId } = req.query;
      const result = await this.metricsService.getStockByDay(
        startDate as string,
        endDate as string,
        ingredientId ? parseInt(ingredientId as string) : undefined
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}