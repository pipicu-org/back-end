import { Router } from 'express';
import { ingredientController } from '../../config';

const PATH = '/ingredient';

export const ingredientRouter = (controller = ingredientController): Router => {
  const router: Router = Router();

  /**
   * @swagger
   * tags:
   *   name: Ingredients
   *   description: Ingredient management endpoints
   */

  /**
   * @swagger
   * /api/ingredient:
   *   post:
   *     summary: Create a new ingredient
   *     tags: [Ingredients]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/IngredientRequest'
   *           example:
   *             name: "Tomato"
   *             price: 2.50
   *             unitId: 1
   *             lossFactor: 0.1
   *     responses:
   *       201:
   *         description: Ingredient created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/IngredientResponse'
   *             example:
   *               id: 1
   *               name: "Tomato"
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   *       500:
   *         $ref: '#/components/responses/ErrorResponse'
   */
  router.post(`${PATH}`, (req, res, next) => controller.create(req, res, next));

  /**
   * @swagger
   * /api/ingredient/{id}:
   *   get:
   *     summary: Get ingredient by ID
   *     tags: [Ingredients]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Ingredient ID
   *     responses:
   *       200:
   *         description: Ingredient retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/IngredientResponse'
   *             example:
   *               id: 1
   *               name: "Tomato"
   *               unitId: 1
   *               lossFactor: 0.1
   *               createdAt: "2023-01-01T00:00:00Z"
   *               updatedAt: "2023-01-01T00:00:00Z"
   *               unitId: 1
   *               lossFactor: 0.1
   *               createdAt: "2023-01-01T00:00:00Z"
   *               updatedAt: "2023-01-01T00:00:00Z"
   *               unitId: 1
   *               lossFactor: 0.1
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

  /**
   * @swagger
   * /api/ingredient/{id}:
   *   patch:
   *     summary: Update an ingredient
   *     tags: [Ingredients]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Ingredient ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/IngredientRequest'
   *           example:
   *             name: "Updated Tomato"
   *             price: 3.00
   *             unitId: 1
   *             lossFactor: 0.05
   *     responses:
   *       200:
   *         description: Ingredient updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/IngredientResponse'
   *             example:
   *               id: 1
   *               name: "Updated Tomato"
   *               unitId: 1
   *               lossFactor: 0.05
   *               createdAt: "2023-01-01T00:00:00Z"
   *               updatedAt: "2023-01-01T00:00:00Z"
   *       404:
   *         $ref: '#/components/responses/NotFoundError'
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   *       500:
   *         $ref: '#/components/responses/ErrorResponse'
   */
  router.patch(`${PATH}/:id`, (req, res, next) =>
    controller.update(req, res, next),
  );

  /**
   * @swagger
   * /api/ingredient/{id}:
   *   delete:
   *     summary: Delete an ingredient
   *     tags: [Ingredients]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Ingredient ID
   *     responses:
   *       204:
   *         description: Ingredient deleted successfully
   *       404:
   *         $ref: '#/components/responses/NotFoundError'
   *       500:
   *         $ref: '#/components/responses/ErrorResponse'
   */
  router.delete(`${PATH}/:id`, (req, res, next) =>
    controller.delete(req, res, next),
  );

  /**
   * @swagger
   * /api/ingredient:
   *   get:
   *     summary: Get all ingredients with pagination and search
   *     tags: [Ingredients]
   *     parameters:
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *         description: Search term for ingredient name
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
   *         description: Ingredients retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/IngredientResponse'
   *                 pagination:
   *                   $ref: '#/components/schemas/Pagination'
   *           example:
   *             data:
   *               - id: 1
   *                 name: "Tomato"
   *                 unitId: 1
   *                 lossFactor: 0.1
   *                 createdAt: "2023-01-01T00:00:00Z"
   *                 updatedAt: "2023-01-01T00:00:00Z"
   *             pagination:
   *               total: 1
   *               page: 1
   *               limit: 10
   *               totalPages: 1
   *       500:
   *         $ref: '#/components/responses/ErrorResponse'
   */
  router.get(`${PATH}`, (req, res, next) =>
    controller.searchIngredients(req, res, next),
  );

  return router;
};
