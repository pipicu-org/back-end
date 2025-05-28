import { Order } from '../api/models';
import { OrderController } from '../api/order/order.controller';
import { OrderRepository } from '../api/order/order.repository';
import { OrderService } from '../api/order/order.service';
import { AppDataSource, initializeDataSource } from './initializeDatabase';

// import config from './config';

initializeDataSource().catch((err) =>
  console.error('Error inicializando la fuente de datos', err),
);

// Tables
export const dbOrderRepository = AppDataSource.getRepository<Order>('Order').extend({});

// Repositories
export const orderRepository = new OrderRepository(dbOrderRepository);

// Services
export const orderService = new OrderService(orderRepository);

// Controllers
export const orderController = new OrderController(orderService);
