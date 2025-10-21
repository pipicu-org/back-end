import { Repository } from 'typeorm';
import { AppDataSource } from '../../config/initializeDatabase';
import {
  OrdersByDayResponseDTO,
  LinesByDayResponseDTO,
  GmvByDayResponseDTO,
  GmvByContactMethodResponseDTO,
  GmvByPaymentMethodResponseDTO,
  StockByDayResponseDTO,
} from '../models/DTO/response/ordersByDayResponseDTO';

export class MetricsRepository {
  private orderRepository: Repository<any>;
  private stockMovementRepository: Repository<any>;

  constructor() {
    this.orderRepository = AppDataSource.getRepository('Order');
    this.stockMovementRepository = AppDataSource.getRepository('StockMovement');
  }

  async getOrdersByDay(startDate?: string, endDate?: string): Promise<OrdersByDayResponseDTO[]> {
    let query = `
      SELECT
        DATE(o."createdAt") AS day,
        COUNT(*) AS total_orders
      FROM "Order" o
      WHERE o."stateId" = 4
    `;

    if (startDate) {
      query += ` AND DATE(o."createdAt") >= '${startDate}'`;
    }
    if (endDate) {
      query += ` AND DATE(o."createdAt") <= '${endDate}'`;
    }

    query += `
      GROUP BY DATE(o."createdAt")
      ORDER BY day
    `;

    const result = await this.orderRepository.query(query);
    return result;
  }

  async getLinesByDay(startDate?: string, endDate?: string): Promise<LinesByDayResponseDTO[]> {
    let query = `
      SELECT
        DATE(o."createdAt") AS day,
        COUNT(l.id) AS total_orders
      FROM "Order" o
      INNER JOIN "Line" l ON l."orderId" = o.id
      WHERE o."stateId" = 4
    `;

    if (startDate) {
      query += ` AND DATE(o."createdAt") >= '${startDate}'`;
    }
    if (endDate) {
      query += ` AND DATE(o."createdAt") <= '${endDate}'`;
    }

    query += `
      GROUP BY DATE(o."createdAt")
      ORDER BY day
    `;

    const result = await this.orderRepository.query(query);
    return result;
  }

  async getGmvByDay(startDate?: string, endDate?: string): Promise<GmvByDayResponseDTO[]> {
    let query = `
      SELECT
        DATE(o."createdAt") AS day,
        SUM(o.total) AS gmv
      FROM "Order" o
      WHERE o."stateId" = 4
    `;

    if (startDate) {
      query += ` AND DATE(o."createdAt") >= '${startDate}'`;
    }
    if (endDate) {
      query += ` AND DATE(o."createdAt") <= '${endDate}'`;
    }

    query += `
      GROUP BY DATE(o."createdAt")
      ORDER BY day
    `;

    const result = await this.orderRepository.query(query);
    return result;
  }

  async getGmvByContactMethod(): Promise<GmvByContactMethodResponseDTO[]> {
    const query = `
      SELECT
        o."contactMethod",
        SUM(o.total) AS gmv
      FROM "Order" o
      WHERE o."stateId" = 4
      GROUP BY o."contactMethod"
      ORDER BY o."contactMethod"
    `;

    const result = await this.orderRepository.query(query);
    return result;
  }

  async getGmvByPaymentMethod(): Promise<GmvByPaymentMethodResponseDTO[]> {
    const query = `
      SELECT
        o."paymentMethod",
        SUM(o.total) AS gmv
      FROM "Order" o
      WHERE o."stateId" = 4
      GROUP BY o."paymentMethod"
      ORDER BY o."paymentMethod"
    `;

    const result = await this.orderRepository.query(query);
    return result;
  }

  async getStockByDay(startDate?: string, endDate?: string, ingredientId?: number): Promise<StockByDayResponseDTO[]> {
    let query = `
      SELECT
        DATE(sm."createdAt") AS day,
        i.id AS "ingredientId",
        i.name AS "ingredientName",
        SUM(CASE
          WHEN sm."stockMovementTypeId" = 1 THEN sm.quantity
          WHEN sm."stockMovementTypeId" = 2 THEN -sm.quantity
          ELSE sm.quantity
        END) AS quantity
      FROM "StockMovement" sm
      INNER JOIN "Ingredient" i ON i.id = sm."ingredientId"
      WHERE sm."stockMovementTypeId" IN (1, 2)
    `;

    if (startDate) {
      query += ` AND DATE(sm."createdAt") >= '${startDate}'`;
    }
    if (endDate) {
      query += ` AND DATE(sm."createdAt") <= '${endDate}'`;
    }
    if (ingredientId) {
      query += ` AND i.id = ${ingredientId}`;
    }

    query += `
      GROUP BY DATE(sm."createdAt"), i.id, i.name
      ORDER BY day
    `;

    const result = await this.stockMovementRepository.query(query);
    return result;
  }
}