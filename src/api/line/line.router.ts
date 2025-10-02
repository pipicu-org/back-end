import { Router } from 'express';
import { lineController } from '../../config';

const PATH = '/preparations';

export const lineRouter = (controller = lineController): Router => {
  const router: Router = Router();

  /**
   * @swagger
   * tags:
   *   name: Preparations
   *   description: Order line/preparation management endpoints
   */

  /**
   * @swagger
   * /api/preparations/kitchen:
   *   patch:
   *     summary: Change preparation state
   *     tags: [Preparations]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - lineId
   *               - newStateId
   *             properties:
   *               lineId:
   *                 type: integer
   *                 description: Line ID
   *               newStateId:
   *                 type: integer
   *                 description: New state ID
   *             example:
   *               lineId: 1
   *               newStateId: 2
   *     responses:
   *       200:
   *         description: Preparation state changed successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/LineResponse'
   *       404:
   *         $ref: '#/components/responses/NotFoundError'
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   *       500:
   *         $ref: '#/components/responses/ErrorResponse'
   */
  router.patch(`${PATH}/kitchen`, (req, res, next) =>
    controller.changeStateLine(req, res, next),
  );

  /**
   * @swagger
   * /api/preparations/kitchen/{id}:
   *   get:
   *     summary: Get preparation by ID
   *     tags: [Preparations]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Preparation ID
   *     responses:
   *       200:
   *         description: Preparation retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/LineResponse'
   *       404:
   *         $ref: '#/components/responses/NotFoundError'
   *       500:
   *         $ref: '#/components/responses/ErrorResponse'
   */
  router.get(`${PATH}/kitchen/:id`, (req, res, next) =>
    controller.findById(req, res, next),
  );

  /**
   * @swagger
   * /api/preparations/state:
   *   get:
   *     summary: Get preparations by state
   *     tags: [Preparations]
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
   *         description: Preparations retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/LineResponse'
   *                 pagination:
   *                   $ref: '#/components/schemas/Pagination'
   *       500:
   *         $ref: '#/components/responses/ErrorResponse'
   */
  router.get(`${PATH}/state`, (req, res, next) =>
    controller.getLinesByState(req, res, next),
  );

  return router;
};
