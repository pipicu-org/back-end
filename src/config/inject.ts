import { Line, Order, State } from '../api/models';
import { LineRepository } from '../api/line/line.repository';
import { OrderController } from '../api/order/order.controller';
import { OrderRepository } from '../api/order/order.repository';
import { OrderService } from '../api/order/order.service';
import { StateController } from '../api/state/state.controller';
import { StateRepository } from '../api/state/state.repository';
import { StateService } from '../api/state/state.service';
import { AppDataSource, initializeDataSource } from './initializeDatabase';
import { initializeWebSocket } from '../middlewares/webSocket';

// import config from './config';

initializeDataSource().catch((err) =>
  console.error('Error inicializando la fuente de datos', err),
);

initializeWebSocket();

// Tables
export const dbOrderRepository = AppDataSource.getRepository<Order>(
  'Order',
).extend({});

export const dbStateRepository = AppDataSource.getRepository<State>(
  'State',
).extend({});

export const dbLineRepository = AppDataSource.getRepository<Line>(
  'Line',
).extend({});

// Repositories

export const stateRepository = new StateRepository(dbStateRepository);

export const orderRepository = new OrderRepository(dbOrderRepository);

export const lineRepository = new LineRepository(dbLineRepository);

// Services

export const orderService = new OrderService(orderRepository);

export const stateService = new StateService(stateRepository);

// Controllers
export const orderController = new OrderController(orderService);

export const stateController = new StateController(stateService);
