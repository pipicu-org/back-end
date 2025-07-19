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
      const updatedOrder = await this.orderService.update(
        Number(req.params.id),
        orderRequestDTO,
      );
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
      const search =
        typeof req.query.search === 'string' ? req.query.search : '';
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const ordersResponse = await this.orderService.getOrdersByClientName(
        search,
        page,
        limit,
      );
      res.status(200).json(ordersResponse);
    } catch (error) {
      next(error);
    }
  }

  async changeStateOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const orderId = Number(req.query.orderId);
      const stateId = Number(req.query.stateId);
      if (isNaN(orderId) || isNaN(stateId)) {
        throw new Error('Invalid order or state ID');
      }
      const updatedOrder = await this.orderService.changeStateOrder(
        orderId,
        stateId,
      );
      res.status(200).json(updatedOrder);
    } catch (error) {
      next(error);
    }
  }

  async getComanda(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const comanda = await this.orderService.getComanda(page, limit);
      res.status(200).json(comanda);
    } catch (error) {
      next(error);
    }
  }
}
