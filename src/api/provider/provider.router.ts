import { Router } from 'express';
import { providerController } from '../../config';
import multer from 'multer';

const PATH = '/provider';

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export const providerRouter = (controller = providerController): Router => {
  const router = Router();

  // IMPORTANT: Specific routes must come BEFORE parameterized routes
  router.get(`${PATH}/template`, (req, res, next) =>
    controller.downloadTemplate(req, res, next),
  );

  router.post(`${PATH}/upload`, upload.single('file'), (req, res, next) =>
    controller.uploadExcel(req, res, next),
  );

  /**
   * @swagger
   * tags:
   *   name: Providers
   *   description: Provider management endpoints
   */

  /**
   * @swagger
   * /api/provider:
   *   post:
   *     summary: Create a new provider
   *     tags: [Providers]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ProviderRequest'
   *           example:
   *             name: "ABC Supplies"
   *             description: "Provider of office supplies"
   *     responses:
   *       201:
   *         description: Provider created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ProviderResponse'
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   *       500:
   *         $ref: '#/components/responses/ErrorResponse'
   */
  router.post(`${PATH}`, (req, res, next) => controller.create(req, res, next));

  /**
   * @swagger
   * /api/provider/{id}:
   *   get:
   *     summary: Get provider by ID
   *     tags: [Providers]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Provider ID
   *     responses:
   *       200:
   *         description: Provider retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ProviderResponse'
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
   * /api/provider/{id}:
   *   patch:
   *     summary: Update a provider
   *     tags: [Providers]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Provider ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ProviderRequest'
   *     responses:
   *       200:
   *         description: Provider updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ProviderResponse'
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
   * /api/provider/{id}:
   *   delete:
   *     summary: Delete a provider
   *     tags: [Providers]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Provider ID
   *     responses:
   *       200:
   *         description: Provider deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ProviderResponse'
   *       404:
   *         $ref: '#/components/responses/NotFoundError'
   *       400:
   *         description: Bad Request - Provider has existing purchases
   *         $ref: '#/components/responses/ErrorResponse'
   *       500:
   *         $ref: '#/components/responses/ErrorResponse'
   */
  router.delete(`${PATH}/:id`, (req, res, next) =>
    controller.delete(req, res, next),
  );

  /**
   * @swagger
   * /api/provider:
   *   get:
   *     summary: Get all providers with pagination, search, and sorting
   *     tags: [Providers]
   *     parameters:
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *         description: Search term for provider name
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
   *       - in: query
   *         name: sort
   *         schema:
   *           type: string
   *           enum: [name, createdAt]
   *         description: Sort field
   *     responses:
   *       200:
   *         description: Providers retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/ProviderResponse'
   *                 pagination:
   *                   $ref: '#/components/schemas/Pagination'
   *       500:
   *         $ref: '#/components/responses/ErrorResponse'
   */
  router.get(`${PATH}`, (req, res, next) =>
    controller.searchProviders(req, res, next),
  );

  return router;
};