import { Router } from 'express';
import { recipeIngredientController } from '../../config';

const PATH = '/recipeIngredient';

export const recipeIngredientRouter = (
  controller = recipeIngredientController,
): Router => {
  const router: Router = Router();

  /**
   * @swagger
   * tags:
   *   name: RecipeIngredient
   *   description: Recipe ingredients management endpoints
   */

  /**
   * @swagger
   * /api/recipeIngredient:
   *   get:
   *     summary: Get kitchen board with recipe ingredients
   *     tags: [RecipeIngredient]
   *     responses:
   *       200:
   *         description: Kitchen board retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/RecipeIngredientResponse'
   *       500:
   *         $ref: '#/components/responses/ErrorResponse'
   */
  router.get(`${PATH}`, (req, res, next) =>
    controller.getKitchenBoard(req, res, next),
  );
  return router;
};
