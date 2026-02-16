import { Router } from 'express';
import { stockMovementController } from '../../config';

const PATH = '/stockMovement';

export const stockMovementRouter = (
  controller = stockMovementController,
): Router => {
  const router: Router = Router();

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
   *             example:
   *               total: 50
   *               page: 1
   *               limit: 10
   *               data:
   *                 - id: 1
   *                   ingredient:
   *                     id: 1
   *                     name: "Tomato"
   *                   quantity: 10.5
   *                   unit:
   *                     id: 1
   *                     name: "kg"
   *                   stockMovementType:
   *                     id: 1
   *                     name: "Compra"
   *                   purchaseItemId: null
   *                   createdAt: "2023-01-01T00:00:00Z"
   *                   updatedAt: "2023-01-01T00:00:00Z"
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
   *             example:
   *               id: 1
   *               ingredient:
   *                 id: 1
   *                 name: "Tomato"
   *               quantity: 10.5
   *               unit:
   *                 id: 1
   *                 name: "Kilogram"
   *               stockMovementType:
   *                 id: 1
   *                 name: "Compra"
   *               purchaseItemId: null
   *               createdAt: "2023-01-01T00:00:00Z"
   *               updatedAt: "2023-01-01T00:00:00Z"
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
