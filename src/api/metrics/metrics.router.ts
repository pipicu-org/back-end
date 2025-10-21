import { Router } from 'express';
import { MetricsController } from './metrics.controller';

const PATH = '/metrics';

export const metricsRouter = (controller: MetricsController): Router => {
  const router: Router = Router();

  /**
   * @swagger
   * tags:
   *   name: Metrics
   *   description: Business metrics endpoints
   */

  /**
   * @swagger
   * /api/metrics/orders-by-day:
   *   get:
   *     summary: Get orders count by day
   *     tags: [Metrics]
   *     parameters:
   *       - in: query
   *         name: startDate
   *         schema:
   *           type: string
   *           format: date
   *         description: Start date in YYYY-MM-DD format
   *         example: "2024-01-01"
   *       - in: query
   *         name: endDate
   *         schema:
   *           type: string
   *           format: date
   *         description: End date in YYYY-MM-DD format
   *         example: "2024-12-31"
   *     responses:
   *       200:
   *         description: Orders by day retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   day:
   *                     type: string
   *                     format: date
   *                     example: "2024-01-01"
   *                   total_orders:
   *                     type: integer
   *                     example: 25
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   *       500:
   *         $ref: '#/components/responses/ErrorResponse'
   */
  router.get(`${PATH}/orders-by-day`, (req, res, next) =>
    controller.getOrdersByDay(req, res, next),
  );

  /**
   * @swagger
   * /api/metrics/lines-by-day:
   *   get:
   *     summary: Get order lines count by day
   *     tags: [Metrics]
   *     parameters:
   *       - in: query
   *         name: startDate
   *         schema:
   *           type: string
   *           format: date
   *         description: Start date in YYYY-MM-DD format
   *         example: "2024-01-01"
   *       - in: query
   *         name: endDate
   *         schema:
   *           type: string
   *           format: date
   *         description: End date in YYYY-MM-DD format
   *         example: "2024-12-31"
   *     responses:
   *       200:
   *         description: Order lines by day retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   day:
   *                     type: string
   *                     format: date
   *                     example: "2024-01-01"
   *                   total_orders:
   *                     type: integer
   *                     example: 45
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   *       500:
   *         $ref: '#/components/responses/ErrorResponse'
   */
  router.get(`${PATH}/lines-by-day`, (req, res, next) =>
    controller.getLinesByDay(req, res, next),
  );

  /**
   * @swagger
   * /api/metrics/gmv-by-day:
   *   get:
   *     summary: Get Gross Merchandise Value (GMV) by day
   *     tags: [Metrics]
   *     parameters:
   *       - in: query
   *         name: startDate
   *         schema:
   *           type: string
   *           format: date
   *         description: Start date in YYYY-MM-DD format
   *         example: "2024-01-01"
   *       - in: query
   *         name: endDate
   *         schema:
   *           type: string
   *           format: date
   *         description: End date in YYYY-MM-DD format
   *         example: "2024-12-31"
   *     responses:
   *       200:
   *         description: GMV by day retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   day:
   *                     type: string
   *                     format: date
   *                     example: "2024-01-01"
   *                   gmv:
   *                     type: number
   *                     format: float
   *                     example: 1250.50
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   *       500:
   *         $ref: '#/components/responses/ErrorResponse'
   */
  router.get(`${PATH}/gmv-by-day`, (req, res, next) =>
    controller.getGmvByDay(req, res, next),
  );

  /**
   * @swagger
   * /api/metrics/gmv-by-contact-method:
   *   get:
   *     summary: Get Gross Merchandise Value (GMV) by contact method
   *     tags: [Metrics]
   *     responses:
   *       200:
   *         description: GMV by contact method retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   contactMethod:
   *                     type: string
   *                     example: "phone"
   *                   gmv:
   *                     type: number
   *                     format: float
   *                     example: 2500.75
   *       500:
   *         $ref: '#/components/responses/ErrorResponse'
   */
  router.get(`${PATH}/gmv-by-contact-method`, (req, res, next) =>
    controller.getGmvByContactMethod(req, res, next),
  );

  /**
   * @swagger
   * /api/metrics/gmv-by-payment-method:
   *   get:
   *     summary: Get Gross Merchandise Value (GMV) by payment method
   *     tags: [Metrics]
   *     responses:
   *       200:
   *         description: GMV by payment method retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   paymentMethod:
   *                     type: string
   *                     example: "cash"
   *                   gmv:
   *                     type: number
   *                     format: float
   *                     example: 1800.25
   *       500:
   *         $ref: '#/components/responses/ErrorResponse'
   */
  router.get(`${PATH}/gmv-by-payment-method`, (req, res, next) =>
    controller.getGmvByPaymentMethod(req, res, next),
  );

  /**
   * @swagger
   * /api/metrics/stock-by-day:
   *   get:
   *     summary: Get stock movements by day and ingredient
   *     tags: [Metrics]
   *     parameters:
   *       - in: query
   *         name: startDate
   *         schema:
   *           type: string
   *           format: date
   *         description: Start date in YYYY-MM-DD format
   *         example: "2024-01-01"
   *       - in: query
   *         name: endDate
   *         schema:
   *           type: string
   *           format: date
   *         description: End date in YYYY-MM-DD format
   *         example: "2024-12-31"
   *       - in: query
   *         name: ingredientId
   *         schema:
   *           type: integer
   *         description: Filter by specific ingredient ID
   *         example: 1
   *     responses:
   *       200:
   *         description: Stock movements by day retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   day:
   *                     type: string
   *                     format: date
   *                     example: "2024-01-01"
   *                   ingredientId:
   *                     type: integer
   *                     example: 1
   *                   ingredientName:
   *                     type: string
   *                     example: "Tomato"
   *                   quantity:
   *                     type: number
   *                     format: float
   *                     example: 15.5
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   *       500:
   *         $ref: '#/components/responses/ErrorResponse'
   */
  router.get(`${PATH}/stock-by-day`, (req, res, next) =>
    controller.getStockByDay(req, res, next),
  );

  return router;
};