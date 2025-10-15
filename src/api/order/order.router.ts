import { Router } from 'express';
import { orderController } from '../../config/inject';

const PATH = '/orders';

export const orderRouter = (controller = orderController): Router => {
  const router: Router = Router();

  /**
   * @swagger
   * tags:
   *   name: Orders
   *   description: Order management endpoints
   */

  /**
   * @swagger
   * /api/orders/reception:
   *   post:
   *     summary: Create a new order
   *     tags: [Orders]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - client
   *               - deliveryTime
   *               - contactMethod
   *               - paymentMethod
   *               - lines
   *             properties:
   *               client:
   *                 type: integer
   *                 example: 1
   *               deliveryTime:
   *                 type: string
   *                 format: date-time
   *                 example: "2024-01-01T12:00:00Z"
   *               contactMethod:
   *                 type: string
   *                 example: "phone"
   *               paymentMethod:
   *                 type: string
   *                 example: "cash"
   *               lines:
   *                 type: array
   *                 items:
   *                   type: object
   *                   properties:
   *                     product:
   *                       type: integer
   *                       example: 1
   *                     quantity:
   *                       type: integer
   *                       example: 2
   *                     personalizations:
   *                       type: array
   *                       items:
   *                         type: object
   *                       example: []
   *           example:
   *             client: 1
   *             deliveryTime: "2024-01-01T12:00:00Z"
   *             contactMethod: "phone"
   *             paymentMethod: "cash"
   *             lines:
   *               - product: 1
   *                 quantity: 2
   *                 personalizations: []
   *     responses:
   *       201:
   *         description: Order created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   example: "1"
   *                 state:
   *                   type: string
   *                   example: "pending"
   *                 client:
   *                   type: string
   *                   example: "Juan Pérez"
   *                 phoneNumber:
   *                   type: string
   *                   example: "123456789"
   *                 address:
   *                   type: string
   *                   example: "Calle Principal 123"
   *                 deliveryTime:
   *                   type: string
   *                   format: date-time
   *                   example: "2024-01-01T12:00:00Z"
   *                 contactMethod:
   *                   type: string
   *                   example: "phone"
   *                 paymentMethod:
   *                   type: string
   *                   example: "cash"
   *                 total:
   *                   type: number
   *                   example: 25.99
   *                 lines:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                         example: "1"
   *                       product:
   *                         type: string
   *                         example: "Pizza Margherita"
   *                       quantity:
   *                         type: integer
   *                         example: 2
   *                       totalPrice:
   *                         type: number
   *                         example: 25.98
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   *       500:
   *         $ref: '#/components/responses/ErrorResponse'
   */
  router.post(`${PATH}/reception`, (req, res, next) =>
    controller.create(req, res, next),
  );

  /**
   * @swagger
   * /api/orders/reception/{id}:
   *   get:
   *     summary: Get order by ID
   *     tags: [Orders]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Order ID
   *     responses:
   *       200:
   *         description: Order retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   example: "1"
   *                 state:
   *                   type: string
   *                   example: "pending"
   *                 client:
   *                   type: string
   *                   example: "Juan Pérez"
   *                 phoneNumber:
   *                   type: string
   *                   example: "123456789"
   *                 address:
   *                   type: string
   *                   example: "Calle Principal 123"
   *                 deliveryTime:
   *                   type: string
   *                   format: date-time
   *                   example: "2024-01-01T12:00:00Z"
   *                 contactMethod:
   *                   type: string
   *                   example: "phone"
   *                 paymentMethod:
   *                   type: string
   *                   example: "cash"
   *                 total:
   *                   type: number
   *                   example: 25.99
   *                 lines:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                         example: "1"
   *                       product:
   *                         type: string
   *                         example: "Pizza Margherita"
   *                       quantity:
   *                         type: integer
   *                         example: 2
   *                       totalPrice:
   *                         type: number
   *                         example: 25.98
   *       404:
   *         $ref: '#/components/responses/NotFoundError'
   *       500:
   *         $ref: '#/components/responses/ErrorResponse'
   */
  router.get(`${PATH}/reception/:id`, (req, res, next) =>
    controller.getById(req, res, next),
  );

  /**
   * @swagger
   * /api/orders/comanda/kitchen:
   *   get:
   *     summary: Get comanda for kitchen
   *     tags: [Orders]
   *     responses:
   *       200:
   *         description: Comanda retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ComandaResponse'
   *       500:
   *         $ref: '#/components/responses/ErrorResponse'
   */
  router.get(`${PATH}/comanda/kitchen`, (req, res, next) =>
    controller.getComanda(req, res, next),
  );

  /**
   * @swagger
   * /api/orders/reception/{id}:
   *   patch:
   *     summary: Update an order
   *     tags: [Orders]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Order ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - client
   *               - deliveryTime
   *               - contactMethod
   *               - paymentMethod
   *               - lines
   *             properties:
   *               client:
   *                 type: integer
   *                 example: 1
   *               deliveryTime:
   *                 type: string
   *                 format: date-time
   *                 example: "2024-01-01T12:00:00Z"
   *               contactMethod:
   *                 type: string
   *                 example: "phone"
   *               paymentMethod:
   *                 type: string
   *                 example: "cash"
   *               lines:
   *                 type: array
   *                 items:
   *                   type: object
   *                   properties:
   *                     product:
   *                       type: integer
   *                       example: 1
   *                     quantity:
   *                       type: integer
   *                       example: 2
   *                     personalizations:
   *                       type: array
   *                       items:
   *                         type: object
   *                       example: []
   *           example:
   *             client: 1
   *             deliveryTime: "2024-01-01T12:00:00Z"
   *             contactMethod: "phone"
   *             paymentMethod: "cash"
   *             lines:
   *               - product: 1
   *                 quantity: 2
   *                 personalizations: []
   *     responses:
   *       200:
   *         description: Order updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   example: "1"
   *                 state:
   *                   type: string
   *                   example: "pending"
   *                 client:
   *                   type: string
   *                   example: "Juan Pérez"
   *                 phoneNumber:
   *                   type: string
   *                   example: "123456789"
   *                 address:
   *                   type: string
   *                   example: "Calle Principal 123"
   *                 deliveryTime:
   *                   type: string
   *                   format: date-time
   *                   example: "2024-01-01T12:00:00Z"
   *                 contactMethod:
   *                   type: string
   *                   example: "phone"
   *                 paymentMethod:
   *                   type: string
   *                   example: "cash"
   *                 total:
   *                   type: number
   *                   example: 25.99
   *                 lines:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                         example: "1"
   *                       product:
   *                         type: string
   *                         example: "Pizza Margherita"
   *                       quantity:
   *                         type: integer
   *                         example: 2
   *                       totalPrice:
   *                         type: number
   *                         example: 25.98
   *       404:
   *         $ref: '#/components/responses/NotFoundError'
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   *       500:
   *         $ref: '#/components/responses/ErrorResponse'
   */
  router.patch(`${PATH}/reception/:id`, (req, res, next) =>
    controller.update(req, res, next),
  );

  /**
   * @swagger
   * /api/orders/reception/{id}:
   *   delete:
   *     summary: Delete an order
   *     tags: [Orders]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Order ID
   *     responses:
   *       204:
   *         description: Order deleted successfully
   *       404:
   *         $ref: '#/components/responses/NotFoundError'
   *       500:
   *         $ref: '#/components/responses/ErrorResponse'
   */
  router.delete(`${PATH}/reception/:id`, (req, res, next) =>
    controller.delete(req, res, next),
  );

  /**
   * @swagger
   * /api/orders/reception:
   *   get:
   *     summary: Get orders by client name
   *     tags: [Orders]
   *     parameters:
   *       - in: query
   *         name: clientName
   *         schema:
   *           type: string
   *         description: Client name to search
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *         description: Page number
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *         description: Number of items per page
   *     responses:
   *       200:
   *         description: Orders retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                         example: "1"
   *                       state:
   *                         type: string
   *                         example: "pending"
   *                       client:
   *                         type: string
   *                         example: "Juan Pérez"
   *                       phoneNumber:
   *                         type: string
   *                         example: "123456789"
   *                       address:
   *                         type: string
   *                         example: "Calle Principal 123"
   *                       deliveryTime:
   *                         type: string
   *                         format: date-time
   *                         example: "2024-01-01T12:00:00Z"
   *                       contactMethod:
   *                         type: string
   *                         example: "phone"
   *                       paymentMethod:
   *                         type: string
   *                         example: "cash"
   *                       total:
   *                         type: number
   *                         example: 25.99
   *                       lines:
   *                         type: array
   *                         items:
   *                           type: object
   *                           properties:
   *                             id:
   *                               type: string
   *                               example: "1"
   *                             product:
   *                               type: string
   *                               example: "Pizza Margherita"
   *                             quantity:
   *                               type: integer
   *                               example: 2
   *                             totalPrice:
   *                               type: number
   *                               example: 25.98
   *                 pagination:
   *                   $ref: '#/components/schemas/Pagination'
   *       500:
   *         $ref: '#/components/responses/ErrorResponse'
   */
  router.get(`${PATH}/reception`, (req, res, next) =>
    controller.getOrdersByClientName(req, res, next),
  );

  /**
   * @swagger
   * /api/orders/state:
   *   get:
   *     summary: Get orders by state
   *     tags: [Orders]
   *     parameters:
   *       - in: query
   *         name: stateId
   *         schema:
   *           type: integer
   *         description: State ID
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *         description: Page number
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *         description: Number of items per page
   *     responses:
   *       200:
   *         description: Orders retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                         example: "1"
   *                       state:
   *                         type: string
   *                         example: "pending"
   *                       client:
   *                         type: string
   *                         example: "Juan Pérez"
   *                       phoneNumber:
   *                         type: string
   *                         example: "123456789"
   *                       address:
   *                         type: string
   *                         example: "Calle Principal 123"
   *                       deliveryTime:
   *                         type: string
   *                         format: date-time
   *                         example: "2024-01-01T12:00:00Z"
   *                       contactMethod:
   *                         type: string
   *                         example: "phone"
   *                       paymentMethod:
   *                         type: string
   *                         example: "cash"
   *                       total:
   *                         type: number
   *                         example: 25.99
   *                       lines:
   *                         type: array
   *                         items:
   *                           type: object
   *                           properties:
   *                             id:
   *                               type: string
   *                               example: "1"
   *                             product:
   *                               type: string
   *                               example: "Pizza Margherita"
   *                             quantity:
   *                               type: integer
   *                               example: 2
   *                             totalPrice:
   *                               type: number
   *                               example: 25.98
   *                 pagination:
   *                   $ref: '#/components/schemas/Pagination'
   *       500:
   *         $ref: '#/components/responses/ErrorResponse'
   */
  router.get(`${PATH}/state`, (req, res, next) =>
    controller.getOrdersByState(req, res, next),
  );

  /**
   * @swagger
   * /api/orders/state:
   *   patch:
   *     summary: Change order state
   *     tags: [Orders]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - orderId
   *               - stateId
   *             properties:
   *               orderId:
   *                 type: integer
   *                 description: Order ID
   *               stateId:
   *                 type: integer
   *                 description: New state ID
   *             example:
   *               orderId: 1
   *               stateId: 2
   *     responses:
   *       200:
   *         description: Order state changed successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   example: "1"
   *                 state:
   *                   type: string
   *                   example: "pending"
   *                 client:
   *                   type: string
   *                   example: "Juan Pérez"
   *                 phoneNumber:
   *                   type: string
   *                   example: "123456789"
   *                 address:
   *                   type: string
   *                   example: "Calle Principal 123"
   *                 deliveryTime:
   *                   type: string
   *                   format: date-time
   *                   example: "2024-01-01T12:00:00Z"
   *                 contactMethod:
   *                   type: string
   *                   example: "phone"
   *                 paymentMethod:
   *                   type: string
   *                   example: "cash"
   *                 total:
   *                   type: number
   *                   example: 25.99
   *                 lines:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                         example: "1"
   *                       product:
   *                         type: string
   *                         example: "Pizza Margherita"
   *                       quantity:
   *                         type: integer
   *                         example: 2
   *                       totalPrice:
   *                         type: number
   *                         example: 25.98
   *       404:
   *         $ref: '#/components/responses/NotFoundError'
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   *       500:
   *         $ref: '#/components/responses/ErrorResponse'
   */
  router.patch(`${PATH}/state`, (req, res, next) =>
    controller.changeStateOrder(req, res, next),
  );

  /**
   * @swagger
   * /api/orders/kitchen:
   *   get:
   *     summary: Get kitchen orders
   *     tags: [Orders]
   *     responses:
   *       200:
   *         description: Kitchen orders retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: string
   *                     example: "1"
   *                   state:
   *                     type: string
   *                     example: "pending"
   *                   client:
   *                     type: string
   *                     example: "Juan Pérez"
   *                   phoneNumber:
   *                     type: string
   *                     example: "123456789"
   *                   address:
   *                     type: string
   *                     example: "Calle Principal 123"
   *                   deliveryTime:
   *                     type: string
   *                     format: date-time
   *                     example: "2024-01-01T12:00:00Z"
   *                   contactMethod:
   *                     type: string
   *                     example: "phone"
   *                   paymentMethod:
   *                     type: string
   *                     example: "cash"
   *                   total:
   *                     type: number
   *                     example: 25.99
   *                   lines:
   *                     type: array
   *                     items:
   *                       type: object
   *                       properties:
   *                         id:
   *                           type: string
   *                           example: "1"
   *                         product:
   *                           type: string
   *                           example: "Pizza Margherita"
   *                         quantity:
   *                           type: integer
   *                           example: 2
   *                         totalPrice:
   *                           type: number
   *                           example: 25.98
   *       500:
   *         $ref: '#/components/responses/ErrorResponse'
   */
  router.get(`${PATH}/kitchen`, (req, res, next) =>
    controller.getKitchenOrders(req, res, next),
  );

  return router;
};
