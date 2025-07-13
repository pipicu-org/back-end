import { Router } from 'express';
import { ingredientController } from '../../config';

const PATH = '/ingredient';

export const ingredientRouter = (controller = ingredientController): Router => {
  const router: Router = Router();

  router.post(`${PATH}`, (req, res, next) => controller.create(req, res, next));
  router.get(`${PATH}/:id`, (req, res, next) =>
    controller.getById(req, res, next),
  );
  router.patch(`${PATH}/:id`, (req, res, next) =>
    controller.update(req, res, next),
  );
  router.delete(`${PATH}/:id`, (req, res, next) =>
    controller.delete(req, res, next),
  );
  router.get(`${PATH}`, (req, res, next) =>
    controller.searchIngredients(req, res, next),
  );

  return router;
};
