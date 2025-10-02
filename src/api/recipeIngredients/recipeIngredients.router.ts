import { Router } from 'express';
import { recipeIngredientsController } from '../../config';

const PATH = '/recipeIngredients';

export const recipeIngredientsRouter = (
  controller = recipeIngredientsController,
): Router => {
  const router: Router = Router();

  /**
   * @swagger
   * tags:
   *   name: RecipeIngredients
   *   description: Recipe ingredients management endpoints
   */

  /**
   * @swagger
   * /api/recipeIngredients:
   *   get:
   *     summary: Get kitchen board with recipe ingredients
   *     tags: [RecipeIngredients]
   *     responses:
   *       200:
   *         description: Kitchen board retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/RecipeIngredientsResponse'
   *       500:
   *         $ref: '#/components/responses/ErrorResponse'
   */
  router.get(`${PATH}`, (req, res, next) =>
    controller.getKitchenBoard(req, res, next),
  );
  return router;
};
