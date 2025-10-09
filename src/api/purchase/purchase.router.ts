import { Router } from 'express';
import { purchaseController } from '../../config';

const PATH = '/purchase';

/**
 * @swagger
 * tags:
 *   name: Purchases
 *   description: Purchase management endpoints
 */

export const purchaseRouter = (controller = purchaseController): Router => {
  const router: Router = Router();

  /**
   * @swagger
   * /api/purchase:
   *   post:
   *     summary: Create a new purchase with items
   *     tags: [Purchases]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreatePurchaseDto'
   *           example:
   *             providerId: 1
   *             purchaseItems:
   *               - ingredientId: 1
   *                 cost: 10.50
   *                 quantity: 100.00
   *                 unitId: 1
   *                 unitQuantity: 1.00
   *               - ingredientId: 29
   *                 cost: 5.25
   *                 quantity: 50.00
   *                 unitId: 1
   *                 unitQuantity: 1.00
   *     responses:
   *       201:
   *         description: Purchase created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/PurchaseResponseDTO'
   *       400:
   *         description: Bad request
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.post(`${PATH}`, (req, res, next) =>
    controller.createPurchase(req, res, next),
  );

  /**
   * @swagger
   * /api/purchase:
   *   get:
   *     summary: Get all purchases with pagination
   *     tags: [Purchases]
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 0
   *           default: 0
   *         description: Page number (0-based)
   *       - in: query
   *         name: size
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *           default: 10
   *         description: Number of items per page
   *       - in: query
   *         name: sort
   *         schema:
   *           type: string
   *           enum: [date_asc, date_desc]
   *           default: date_desc
   *         description: Sort field and order (field_order)
   *     responses:
   *       200:
   *         description: Purchases retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/PurchasePageResponseDTO'
   *             example:
   *               purchases:
   *                 - id: 1
   *                   providerId: 1
   *                   createdAt: "2023-01-01T00:00:00Z"
   *                   updatedAt: "2023-01-01T00:00:00Z"
   *                   purchaseItems: []
   *               totalElements: 50
   *               totalPages: 5
   *               currentPage: 0
   *               pageSize: 10
   *               hasPrevious: false
   *               hasNext: true
   *       400:
   *         description: Bad request - Invalid parameters
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *             example:
   *               error:
   *                 message: "Page must be >= 0"
   *                 status: 400
   */
  router.get(`${PATH}`, (req, res, next) => {
    controller.getAllPurchases(req, res, next);
  });

  /**
   * @swagger
   * /api/purchase/{id}:
   *   get:
   *     summary: Get purchase by ID
   *     tags: [Purchases]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Purchase retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/PurchaseResponseDTO'
   *       404:
   *         description: Purchase not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.get(`${PATH}/:id`, (req, res, next) => {
    controller.getPurchaseById(req, res, next);
  });

  /**
   * @swagger
   * /api/purchase/{id}:
   *   put:
   *     summary: Update purchase by ID
   *     tags: [Purchases]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdatePurchaseDto'
   *     responses:
   *       200:
   *         description: Purchase updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/PurchaseResponseDTO'
   *       404:
   *         description: Purchase not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.put(`${PATH}/:id`, (req, res, next) => {
    controller.updatePurchase(req, res, next);
  });

  /**
   * @swagger
   * /api/purchase/{id}:
   *   delete:
   *     summary: Delete purchase by ID
   *     tags: [Purchases]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Purchase deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/PurchaseResponseDTO'
   *       404:
   *         description: Purchase not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.delete(`${PATH}/:id`, (req, res, next) => {
    controller.deletePurchase(req, res, next);
  });

  return router;
};
