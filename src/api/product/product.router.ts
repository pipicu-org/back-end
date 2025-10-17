const PATH = '/products';

import { Router } from 'express';
import { productController } from '../../config';

export const productRouter = (controller = productController): Router => {
  const router = Router();

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
   *             example:
   *               data:
   *                 - id: 1
   *                   name: "Pizza Margherita"
   *                   preTaxPrice: 10.99
   *                   price: 12.99
   *                   recipeId: 1
   *                   categoryId: 1
   *                   createdAt: "2023-01-01T00:00:00Z"
   *                   updatedAt: "2023-01-01T00:00:00Z"
   *                   category:
   *                     id: 1
   *                     name: "Pizzas"
   *                   recipe:
   *                     id: 1
   *                     ingredients: []
   *               pagination:
   *                 total: 1
   *                 page: 1
   *                 limit: 10
   *                 totalPages: 1
   *       500:
   *         $ref: '#/components/responses/ErrorResponse'
   */
  router.get(`${PATH}`, (req, res, next) =>
    controller.searchProducts(req, res, next),
  );

  /**
   * @swagger
   * /api/products/custom-product:
   *   post:
   *     summary: Create a custom product
   *     tags: [Products]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CustomProductRequestDTO'
   *           example:
   *             baseProductId: "1"
   *             ingredients:
   *               - id: 1
   *                 quantity: 2
   *               - id: 2
   *                 quantity: 1
   *     responses:
   *       201:
   *         description: Custom product created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ProductResponse'
   *             example:
   *               id: 1
   *               name: "Custom Pizza Margherita"
   *               preTaxPrice: 10.99
   *               price: 12.99
   *               recipeId: 1
   *               categoryId: 1
   *               createdAt: "2023-01-01T00:00:00Z"
   *               updatedAt: "2023-01-01T00:00:00Z"
   *               category:
   *                 id: 1
   *                 name: "Pizzas"
   *               recipe:
   *                 id: 1
   *                 ingredients:
   *                   - id: 1
   *                     quantity: 2
   *                     ingredient:
   *                       id: 1
   *                       name: "Tomato"
   *                   - id: 2
   *                     quantity: 1
   *                     ingredient:
   *                       id: 2
   *                       name: "Cheese"
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   *       500:
   *         $ref: '#/components/responses/ErrorResponse'
   */
  router.post(`${PATH}/custom-product`, (req, res, next) =>
    controller.createCustomProduct(req, res, next),
  );

  /**
   * @swagger
   * /api/products/custom-product/{id}:
   *   get:
   *     summary: Get custom product by ID
   *     tags: [Products]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Custom product ID
   *     responses:
   *       200:
   *         description: Custom product retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ProductResponse'
   *             example:
   *               id: 1
   *               name: "Custom Pizza Margherita"
   *               preTaxPrice: 10.99
   *               price: 12.99
   *               recipeId: 1
   *               categoryId: 1
   *               createdAt: "2023-01-01T00:00:00Z"
   *               updatedAt: "2023-01-01T00:00:00Z"
   *               category:
   *                 id: 1
   *                 name: "Pizzas"
   *               recipe:
   *                 id: 1
   *                 ingredients:
   *                   - id: 1
   *                     quantity: 2
   *                     ingredient:
   *                       id: 1
   *                       name: "Tomato"
   *                   - id: 2
   *                     quantity: 1
   *                     ingredient:
   *                       id: 2
   *                       name: "Cheese"
   *       404:
   *         $ref: '#/components/responses/NotFoundError'
   *       500:
   *         $ref: '#/components/responses/ErrorResponse'
   */
  router.get(`${PATH}/custom-product/:id`, (req, res, next) =>
    controller.getCustomProductById(req, res, next),
  );

  /**
   * @swagger
   * /api/products/custom-products:
   *   get:
   *     summary: Get all custom products with pagination
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
   *         description: Custom products retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/CustomProductResponsePaginatedDTO'
   *             example:
   *               total: 2
   *               page: 1
   *               limit: 10
   *               totalPages: 1
   *               data:
   *                 - id: 1
   *                   baseProductId: 1
   *                   recipeId: 1
   *                   createdAt: "2023-01-01T00:00:00Z"
   *                   updatedAt: "2023-01-01T00:00:00Z"
   *                   baseProduct:
   *                     id: 1
   *                     name: "Pizza Margherita"
   *                     preTaxPrice: 10.99
   *                     price: 12.99
   *                     categoryId: 1
   *                     category:
   *                       id: 1
   *                       name: "Pizzas"
   *                   recipe:
   *                     id: 1
   *                     ingredients:
   *                       - id: 1
   *                         quantity: 2
   *                         ingredient:
   *                           id: 1
   *                           name: "Tomato"
   *                       - id: 2
   *                         quantity: 1
   *                         ingredient:
   *                           id: 2
   *                           name: "Cheese"
   *                 - id: 2
   *                   baseProductId: 2
   *                   recipeId: 2
   *                   createdAt: "2023-01-02T00:00:00Z"
   *                   updatedAt: "2023-01-02T00:00:00Z"
   *                   baseProduct:
   *                     id: 2
   *                     name: "Pizza Pepperoni"
   *                     preTaxPrice: 12.99
   *                     price: 15.99
   *                     categoryId: 1
   *                     category:
   *                       id: 1
   *                       name: "Pizzas"
   *                   recipe:
   *                     id: 2
   *                     ingredients:
   *                       - id: 1
   *                         quantity: 1
   *                         ingredient:
   *                           id: 1
   *                           name: "Tomato"
   *                       - id: 3
   *                         quantity: 3
   *                         ingredient:
   *                           id: 3
   *                           name: "Pepperoni"
   *       500:
   *         $ref: '#/components/responses/ErrorResponse'
   */
  router.get(`${PATH}/custom-products`, (req, res, next) =>
    controller.getAllCustomProducts(req, res, next),
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
   *             example:
   *               id: 1
   *               name: "Pizza Margherita"
   *               preTaxPrice: 10.99
   *               price: 12.99
   *               recipeId: 1
   *               categoryId: 1
   *               createdAt: "2023-01-01T00:00:00Z"
   *               updatedAt: "2023-01-01T00:00:00Z"
   *               category:
   *                 id: 1
   *                 name: "Pizzas"
   *               recipe:
   *                 id: 1
   *                 ingredients: []
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
   *             preTaxPrice: 10.99
   *             price: 12.99
   *             category: 1
   *             ingredients:
   *               - id: 1
   *                 quantity: 2
   *     responses:
   *       201:
   *         description: Product created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ProductResponse'
   *             example:
   *               id: 1
   *               name: "Pizza Margherita"
   *               preTaxPrice: 10.99
   *               price: 12.99
   *               recipeId: 1
   *               categoryId: 1
   *               createdAt: "2023-01-01T00:00:00Z"
   *               updatedAt: "2023-01-01T00:00:00Z"
   *               category:
   *                 id: 1
   *                 name: "Pizzas"
   *               recipe:
   *                 id: 1
   *                 ingredients: []
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
   *           example:
   *             name: "Updated Pizza Margherita"
   *             preTaxPrice: 11.99
   *             price: 13.99
   *             category: 1
   *             ingredients:
   *               - id: 1
   *                 quantity: 3
   *     responses:
   *       200:
   *         description: Product updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ProductResponse'
   *             example:
   *               id: 1
   *               name: "Updated Pizza Margherita"
   *               preTaxPrice: 11.99
   *               price: 13.99
   *               recipeId: 1
   *               categoryId: 1
   *               createdAt: "2023-01-01T00:00:00Z"
   *               updatedAt: "2023-01-01T00:00:00Z"
   *               category:
   *                 id: 1
   *                 name: "Pizzas"
   *               recipe:
   *                 id: 1
   *                 ingredients: []
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
   *             example:
   *               data:
   *                 - id: 1
   *                   name: "Pizza Margherita"
   *                   preTaxPrice: 10.99
   *                   price: 12.99
   *                   recipeId: 1
   *                   categoryId: 1
   *                   createdAt: "2023-01-01T00:00:00Z"
   *                   updatedAt: "2023-01-01T00:00:00Z"
   *                   category:
   *                     id: 1
   *                     name: "Pizzas"
   *                   recipe:
   *                     id: 1
   *                     ingredients: []
   *               pagination:
   *                 total: 1
   *                 page: 1
   *                 limit: 10
   *                 totalPages: 1
   *       500:
   *         $ref: '#/components/responses/ErrorResponse'
   */
  router.get(`${PATH}/category/:categoryId`, (req, res, next) =>
    controller.getProductsByCategoryId(req, res, next),
  );

  return router;
};
