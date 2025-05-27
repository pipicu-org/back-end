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
      res.status(500).json(error);
    }
    next();
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const orders = await this.orderService.get(req.body.id);
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json(error);
    }
    next();
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const orderRequestDTO = req.body as OrderRequestDTO;
      const updatedOrder = await this.orderService.update(1, orderRequestDTO);
      res.status(200).json(updatedOrder);
    } catch (error) {
      res.status(500).json(error);
    }
    next();
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await this.orderService.delete(1);
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json(error);
    }
    next();
  }
}
