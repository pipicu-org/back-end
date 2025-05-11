import { OrderController } from "../api/order/order.controller";
import { OrderService } from "../api/order/order.service";
import config from "./config";

// config
// const connection = config.postgres;

// Repositories

// Services
export const orderService = new OrderService();

// Controllers
export const orderController = new OrderController(orderService);
