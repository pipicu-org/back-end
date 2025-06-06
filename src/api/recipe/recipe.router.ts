import { Router } from 'express';
import { recipeController } from '../../config';

const PATH = '/recipe';

export const recipeRouter = (controller = recipeController): Router => {
  const router: Router = Router();

  router.post(`${PATH}`, (req, res, next) => controller.create(req, res, next));
  router.get(`${PATH}/:id`, (req, res, next) =>
    controller.getById(req, res, next),
  );
  router.get(`${PATH}`, (req, res, next) => controller.getAll(req, res, next));
  router.put(`${PATH}/:id`, (req, res, next) =>
    controller.update(req, res, next),
  );
  router.delete(`${PATH}/:id`, (req, res, next) =>
    controller.delete(req, res, next),
  );

  return router;
};
