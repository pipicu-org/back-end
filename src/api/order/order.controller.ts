import { NextFunction, Request, Response } from 'express';
import { IOrderService } from './order.service';
import { OrderRequestDTO } from '../models/DTO/request/orderRequestDTO';

export class OrderController {
  constructor(private readonly orderService: IOrderService = orderService) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const orderRequestDTO = req.body as OrderRequestDTO;
      console.log(orderRequestDTO);
      const order = await this.orderService.create(orderRequestDTO);
      res.status(201).json(order);
    } catch (error: any) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        res.status(400).send('Invalid order ID');
        return;
      }
      const orders = await this.orderService.getById(id);
      res.status(200).json(orders);
    } catch (error: any) {
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
    } catch (error: any) {
      console.log(error);
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await this.orderService.delete(Number(req.params.id));
      res.status(200).json(order);
    } catch (error: any) {
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
    } catch (error: any) {
      next(error);
    }
  }

  async getOrdersByState(req: Request, res: Response, next: NextFunction) {
    try {
      const stateId = Number(req.query.stateId);
      if (isNaN(stateId)) {
        throw new Error('Invalid state ID');
      }
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const ordersResponse = await this.orderService.getOrdersByState(
        stateId,
        page,
        limit,
      );
      res.status(200).json(ordersResponse);
    } catch (error: any) {
      next(error);
    }
  }

  async changeStateOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const orderId = Number(req.body.orderId);
      const stateId = Number(req.body.stateId);
      if (isNaN(orderId) || isNaN(stateId)) {
        throw new Error('Invalid order or state ID');
      }
      const updatedOrder = await this.orderService.changeStateOrder(
        orderId,
        stateId,
      );
      res.status(200).json(updatedOrder);
    } catch (error: any) {
      next(error);
    }
  }

  async getComanda(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const comanda = await this.orderService.getComanda(page, limit);
      res.status(200).json(comanda);
    } catch (error: any) {
      next(error);
    }
  }

  async getKitchenOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const kitchenOrders = await this.orderService.getKitchenOrders(
        page,
        limit,
      );
      res.status(200).json(kitchenOrders);
    } catch (error: any) {
      next(error);
    }
  }
}
