import { Router } from 'express';
import { orderController } from '../../config/inject';

export const PATH = '/order';

export default function getRouter(controller = orderController): Router {
  const router: Router = Router();
  router.post(`${PATH}`, (req, res, next) => controller.create(req, res, next));
  router.get(`${PATH}/:id`, (req, res, next) =>
    controller.getById(req, res, next),
  );
  router.put(`${PATH}/:id`, (req, res, next) =>
    controller.update(req, res, next),
  );
  router.delete(`${PATH}/:id`, (req, res, next) =>
    controller.delete(req, res, next),
  );
  router.get(`${PATH}/:id/totalPrice`, (req, res, next) =>
    controller.getTotalPriceById(req, res, next),
  );
  router.get(`${PATH}/client/:clientId`, (req, res, next) =>
    controller.getByClientId(req, res, next),
  );

  return router;
}
