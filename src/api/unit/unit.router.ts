import { Router } from 'express';
import { unitController } from '../../config';

const PATH = '/unit';

/**
 * @swagger
 * tags:
 *   name: Units
 *   description: Unit management endpoints
 */

export const unitRouter = (controller = unitController): Router => {
  const router: Router = Router();

  /**
   * @swagger
   * /api/unit:
   *   post:
   *     summary: Create a new unit
   *     tags: [Units]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateUnitDto'
   *           example:
   *             name: "Kilogram"
   *             factor: 1.0
   *     responses:
   *       201:
   *         description: Unit created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UnitResponseDTO'
   *       400:
   *         description: Bad request
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.post(`${PATH}`, (req, res, next) =>
    controller.createUnit(req, res, next),
  );

  /**
   * @swagger
   * /api/unit:
   *   get:
   *     summary: Get all units
   *     tags: [Units]
   *     responses:
   *       200:
   *         description: Units retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/UnitResponseDTO'
   */
  router.get(`${PATH}`, (req, res, next) => {
    controller.getAllUnits(req, res, next);
  });

  /**
   * @swagger
   * /api/unit/{id}:
   *   get:
   *     summary: Get unit by ID
   *     tags: [Units]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Unit retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UnitResponseDTO'
   *       404:
   *         description: Unit not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.get(`${PATH}/:id`, (req, res, next) => {
    controller.getUnitById(req, res, next);
  });

  /**
   * @swagger
   * /api/unit/{id}:
   *   put:
   *     summary: Update unit by ID
   *     tags: [Units]
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
   *             $ref: '#/components/schemas/UpdateUnitDto'
   *           example:
   *             name: "Updated Kilogram"
   *             factor: 1.5
   *     responses:
   *       200:
   *         description: Unit updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UnitResponseDTO'
   *       404:
   *         description: Unit not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.put(`${PATH}/:id`, (req, res, next) => {
    controller.updateUnit(req, res, next);
  });

  /**
   * @swagger
   * /api/unit/{id}:
   *   delete:
   *     summary: Delete unit by ID
   *     tags: [Units]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Unit deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UnitResponseDTO'
   *       404:
   *         description: Unit not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.delete(`${PATH}/:id`, (req, res, next) => {
    controller.deleteUnit(req, res, next);
  });

  return router;
};