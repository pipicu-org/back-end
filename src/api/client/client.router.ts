import { Router } from 'express';
import { clientController } from '../../config';

const PATH = '/client';

/**
 * @swagger
 * tags:
 *   name: Clients
 *   description: Client management endpoints
 */

export const clientRouter = (controller = clientController): Router => {
  const router: Router = Router();

  /**
   * @swagger
   * /api/client:
   *   post:
   *     summary: Create a new client
   *     tags: [Clients]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ClientRequestDTO'
   *     responses:
   *       201:
   *         description: Client created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ClientResponseDTO'
   *       400:
   *         description: Bad request
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.post(`${PATH}`, (req, res, next) =>
    controller.createClient(req, res, next),
  );

  /**
   * @swagger
   * /api/client/{id}:
   *   get:
   *     summary: Get client by ID
   *     tags: [Clients]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Client retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ClientResponseDTO'
   *       404:
   *         description: Client not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.get(`${PATH}/:id`, (req, res, next) => {
    controller.getClientById(req, res, next);
  });

  /**
   * @swagger
   * /api/client/{id}:
   *   patch:
   *     summary: Update client by ID
   *     tags: [Clients]
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
   *             $ref: '#/components/schemas/ClientRequestDTO'
   *     responses:
   *       200:
   *         description: Client updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ClientResponseDTO'
   *       404:
   *         description: Client not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.patch(`${PATH}/:id`, (req, res, next) => {
    controller.updateClient(req, res, next);
  });

  /**
   * @swagger
   * /api/client/{id}:
   *   delete:
   *     summary: Delete client by ID
   *     tags: [Clients]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Client deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ClientResponseDTO'
   *       404:
   *         description: Client not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.delete(`${PATH}/:id`, (req, res, next) => {
    controller.deleteClient(req, res, next);
  });

  /**
   * @swagger
   * /api/client:
   *   get:
   *     summary: Search clients
   *     tags: [Clients]
   *     parameters:
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *     responses:
   *       200:
   *         description: Clients retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/ClientResponseDTO'
   *                 total:
   *                   type: integer
   *                 page:
   *                   type: integer
   *                 limit:
   *                   type: integer
   */
  router.get(`${PATH}`, (req, res, next) => {
    controller.searchClients(req, res, next);
  });

  return router;
};
