import { Router } from 'express';
import { orderController } from '../../config/inject';

export const PATH = '/order';

export default function getRouter(controller = orderController): Router {
  const router: Router = Router();
  router.post(`${PATH}`, (req, res, next) => controller.create(req, res, next));
  router.get(`${PATH}/ping`, (req, res, next) =>
    controller.ping(req, res, next),
  );
  router.get(`${PATH}/:id`, (req, res, next) =>
    controller.getById(req, res, next),
  );
  router.put(`${PATH}/:id`, (req, res, next) =>
    controller.update(req, res, next),
  );
  router.delete(`${PATH}/:id`, (req, res, next) =>
    controller.delete(req, res, next),
  );
  return router;
}
