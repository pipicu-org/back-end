import { Router } from 'express';
import { orderController } from '../../config/inject';

const PATH = '/orders';

export const orderRouter = (controller = orderController): Router => {
  const router: Router = Router();
  router.post(`${PATH}/reception`, (req, res, next) =>
    controller.create(req, res, next),
  );

  router.get(`${PATH}/reception/:id`, (req, res, next) =>
    controller.getById(req, res, next),
  );

  router.get(`${PATH}/comanda/kitchen`, (req, res, next) =>
    controller.getComanda(req, res, next),
  );

  router.patch(`${PATH}/reception/:id`, (req, res, next) =>
    controller.update(req, res, next),
  );
  router.delete(`${PATH}/reception/:id`, (req, res, next) =>
    controller.delete(req, res, next),
  );
  router.get(`${PATH}/reception`, (req, res, next) =>
    controller.getOrdersByClientName(req, res, next),
  );

  router.get(`${PATH}/state`, (req, res, next) =>
    controller.getOrdersByState(req, res, next),
  );

  router.patch(`${PATH}/state`, (req, res, next) =>
    controller.changeStateOrder(req, res, next),
  );

  return router;
};
