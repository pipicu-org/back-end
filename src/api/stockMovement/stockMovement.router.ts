import { Router } from 'express';
import { stockMovementController } from '../../config';

const PATH = '/stockMovement';

export const stockMovementRouter = (
  controller = stockMovementController,
): Router => {
  const router: Router = Router();

  /**
   * @swagger
   * tags:
   *   name: StockMovements
   *   description: Stock movement management endpoints
   */

  /**
   * @swagger
   * /api/stockMovement:
   *   post:
   *     summary: Create a new stock movement
   *     tags: [StockMovements]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/StockMovementRequest'
   *           example:
   *             ingredientId: 1
   *             quantity: 10.5
   *             unitId: 1
   *             stockMovementTypeId: 1
   *             purchaseItemId: null
   *     responses:
   *       201:
   *         description: Stock movement created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/StockMovementResponse'
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   *       500:
   *         $ref: '#/components/responses/ErrorResponse'
   */
  router.post(`${PATH}`, (req, res, next) => controller.create(req, res, next));

  /**
   * @swagger
   * /api/stockMovement:
   *   get:
   *     summary: Get paginated stock movements
   *     tags: [StockMovements]
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 1
   *         description: Page number
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *           default: 10
   *         description: Number of items per page
   *     responses:
   *       200:
   *         description: Stock movements retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/StockMovementPagination'
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   *       500:
   *         $ref: '#/components/responses/ErrorResponse'
   */
  router.get(`${PATH}`, (req, res, next) => controller.getAll(req, res, next));

  /**
   * @swagger
   * /api/stockMovement/{id}:
   *   get:
   *     summary: Get stock movement by ID
   *     tags: [StockMovements]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Stock movement ID
   *     responses:
   *       200:
   *         description: Stock movement retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/StockMovementResponse'
   *       404:
   *         $ref: '#/components/responses/NotFoundError'
   *       500:
   *         $ref: '#/components/responses/ErrorResponse'
   */
  router.get(`${PATH}/:id`, (req, res, next) =>
    controller.getById(req, res, next),
  );

  return router;
};
