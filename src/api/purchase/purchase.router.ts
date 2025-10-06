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
   *     summary: Get all purchases
   *     tags: [Purchases]
   *     responses:
   *       200:
   *         description: Purchases retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/PurchaseResponseDTO'
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