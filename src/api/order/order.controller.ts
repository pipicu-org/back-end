import { NextFunction, Request, Response } from 'express';
import { IOrderService } from './order.service';
import { OrderRequestDTO } from '../models/DTO/request/orderRequestDTO';

export class OrderController {
  constructor(private readonly orderService: IOrderService = orderService) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const orderRequestDTO = req.body as OrderRequestDTO;
      const order = await this.orderService.create(orderRequestDTO);
      res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        throw new Error('Invalid order ID');
      }
      const orders = await this.orderService.getById(id);
      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const orderRequestDTO = req.body as OrderRequestDTO;
      const updatedOrder = await this.orderService.update(1, orderRequestDTO);
      res.status(200).json(updatedOrder);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await this.orderService.delete(1);
      res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  }

  async getOrdersByClientName(req: Request, res: Response, next: NextFunction) {
    try {
      const search = req.query.search as string;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      if (!search) {
        throw new Error('Client name is required');
      }

      const orders = await this.orderService.getOrdersByClientName(
        search,
        page,
        limit,
      );
      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  }
}
