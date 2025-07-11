import { Router } from 'express';
import { orderController } from '../../config/inject';

export const PATH = '/orders';

export default function getRouter(controller = orderController): Router {
  const router: Router = Router();
  router.post(`${PATH}/reception`, (req, res, next) =>
    controller.create(req, res, next),
  );

  router.get(`${PATH}/receiption/:id`, (req, res, next) =>
    controller.getById(req, res, next),
  );

  router.patch(`${PATH}/receiption/:id`, (req, res, next) =>
    controller.update(req, res, next),
  );
  router.delete(`${PATH}/:id`, (req, res, next) =>
    controller.delete(req, res, next),
  );
  router.get(`${PATH}/reception?:search&:page&:limit`, (req, res, next) =>
    controller.getOrdersByClientName(req, res, next),
  );

  return router;
}
