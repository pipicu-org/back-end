import { NextFunction, Request, Response } from 'express';
import { IOrderService } from "./order.service";

export class OrderController {
  constructor(
    private readonly orderService: IOrderService = orderService,
  ) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await this.orderService.create({
        id: '1',
        lines: [],
        createdAt: new Date(),
      });
      res.status(201).json(order);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const orders = await this.orderService.get('1');
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await this.orderService.update('1', {
        id: '1',
        lines: [],
        createdAt: new Date(),
      });
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await this.orderService.delete('1');
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}
