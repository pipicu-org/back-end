const PATH = '/products';

import { Router } from 'express';
import { productController } from '../../config';

export const productRouter = (controller = productController): Router => {
  const router = Router();

  /**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management endpoints
 */

  /**
   * @swagger
   * /api/products:
   *   get:
   *     summary: Get all products with pagination
   *     tags: [Products]
   *     parameters:
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
   *         description: Products retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/ProductResponse'
   *                 pagination:
   *                   $ref: '#/components/schemas/Pagination'
   *       500:
   *         $ref: '#/components/responses/ErrorResponse'
   */
  router.get(`${PATH}`, (req, res, next) =>
    controller.searchProducts(req, res, next),
  );

  /**
   * @swagger
   * /api/products/{id}:
   *   get:
   *     summary: Get product by ID
   *     tags: [Products]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Product ID
   *     responses:
   *       200:
   *         description: Product retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ProductResponse'
   *       404:
   *         $ref: '#/components/responses/NotFoundError'
   *       500:
   *         $ref: '#/components/responses/ErrorResponse'
   */
  router.get(`${PATH}/:id`, (req, res, next) =>
    controller.getProductById(req, res, next),
  );

  /**
   * @swagger
   * /api/products:
   *   post:
   *     summary: Create a new product
   *     tags: [Products]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ProductRequest'
   *           example:
   *             name: "Pizza Margherita"
   *             price: 12.99
   *             categoryId: 1
   *             recipeId: 1
   *     responses:
   *       201:
   *         description: Product created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ProductResponse'
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   *       500:
   *         $ref: '#/components/responses/ErrorResponse'
   */
  router.post(`${PATH}`, (req, res, next) =>
    controller.createProduct(req, res, next),
  );

  /**
   * @swagger
   * /api/products/{id}:
   *   patch:
   *     summary: Update an existing product
   *     tags: [Products]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Product ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ProductRequest'
   *     responses:
   *       200:
   *         description: Product updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ProductResponse'
   *       404:
   *         $ref: '#/components/responses/NotFoundError'
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   *       500:
   *         $ref: '#/components/responses/ErrorResponse'
   */
  router.patch(`${PATH}/:id`, (req, res, next) =>
    controller.updateProduct(req, res, next),
  );

  /**
   * @swagger
   * /api/products/{id}:
   *   delete:
   *     summary: Delete a product
   *     tags: [Products]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Product ID
   *     responses:
   *       204:
   *         description: Product deleted successfully
   *       404:
   *         $ref: '#/components/responses/NotFoundError'
   *       500:
   *         $ref: '#/components/responses/ErrorResponse'
   */
  router.delete(`${PATH}/:id`, (req, res, next) =>
    controller.deleteProduct(req, res, next),
  );

  /**
   * @swagger
   * /api/products/category/{categoryId}:
   *   get:
   *     summary: Get products by category
   *     tags: [Products]
   *     parameters:
   *       - in: path
   *         name: categoryId
   *         required: true
   *         schema:
   *           type: integer
   *         description: Category ID
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
   *         description: Products retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/ProductResponse'
   *                 pagination:
   *                   $ref: '#/components/schemas/Pagination'
   *       500:
   *         $ref: '#/components/responses/ErrorResponse'
   */
  router.get(`${PATH}/category/:categoryId`, (req, res, next) =>
    controller.getProductsByCategoryId(req, res, next),
  );

  /**
   * @swagger
   * tags:
   *   name: Products
   *   description: Product management endpoints
   */

  /**
   * @swagger
   * /api/products:
   *   get:
   *     summary: Get all products with pagination
   *     tags: [Products]
   *     parameters:
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
   *         description: Products retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/ProductResponse'
   *                 pagination:
   *                   $ref: '#/components/schemas/Pagination'
   *       500:
   *         $ref: '#/components/responses/ErrorResponse'
   */
  router.get(`${PATH}`, (req, res, next) =>
    controller.searchProducts(req, res, next),
  );

  /**
   * @swagger
   * /api/products/{id}:
   *   get:
   *     summary: Get product by ID
   *     tags: [Products]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Product ID
   *     responses:
   *       200:
   *         description: Product retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ProductResponse'
   *       404:
   *         $ref: '#/components/responses/NotFoundError'
   *       500:
   *         $ref: '#/components/responses/ErrorResponse'
   */
  router.get(`${PATH}/:id`, (req, res, next) =>
    controller.getProductById(req, res, next),
  );

  /**
   * @swagger
   * /api/products:
   *   post:
   *     summary: Create a new product
   *     tags: [Products]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ProductRequest'
   *           example:
   *             name: "Pizza Margherita"
   *             price: 12.99
   *             categoryId: 1
   *             recipeId: 1
   *     responses:
   *       201:
   *         description: Product created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ProductResponse'
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   *       500:
   *         $ref: '#/components/responses/ErrorResponse'
   */
  router.post(`${PATH}`, (req, res, next) =>
    controller.createProduct(req, res, next),
  );

  /**
   * @swagger
   * /api/products/{id}:
   *   patch:
   *     summary: Update an existing product
   *     tags: [Products]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Product ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ProductRequest'
   *     responses:
   *       200:
   *         description: Product updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ProductResponse'
   *       404:
   *         $ref: '#/components/responses/NotFoundError'
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   *       500:
   *         $ref: '#/components/responses/ErrorResponse'
   */
  router.patch(`${PATH}/:id`, (req, res, next) =>
    controller.updateProduct(req, res, next),
  );

  /**
   * @swagger
   * /api/products/{id}:
   *   delete:
   *     summary: Delete a product
   *     tags: [Products]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Product ID
   *     responses:
   *       204:
   *         description: Product deleted successfully
   *       404:
   *         $ref: '#/components/responses/NotFoundError'
   *       500:
   *         $ref: '#/components/responses/ErrorResponse'
   */
  router.delete(`${PATH}/:id`, (req, res, next) =>
    controller.deleteProduct(req, res, next),
  );

  /**
   * @swagger
   * /api/products/category/{categoryId}:
   *   get:
   *     summary: Get products by category
   *     tags: [Products]
   *     parameters:
   *       - in: path
   *         name: categoryId
   *         required: true
   *         schema:
   *           type: integer
   *         description: Category ID
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
   *         description: Products retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/ProductResponse'
   *                 pagination:
   *                   $ref: '#/components/schemas/Pagination'
   *       500:
   *         $ref: '#/components/responses/ErrorResponse'
   */
  router.get(`${PATH}/category/:categoryId`, (req, res, next) =>
    controller.getProductsByCategoryId(req, res, next),
  );

  return router;
}
