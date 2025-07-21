import { Router } from 'express';
import { recipeIngredientsController } from '../../config';

const PATH = '/recipeIngredients';

export const recipeIngredientsRouter = (
  controller = recipeIngredientsController,
): Router => {
  const router: Router = Router();

  router.get(`${PATH}`, (req, res, next) =>
    controller.getKitchenBoard(req, res, next),
  );
  return router;
};
