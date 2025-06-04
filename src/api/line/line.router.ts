import { Router } from 'express';
import { lineController } from '../../config';

const PATH = '/line';

export const lineRouter = (controller = lineController): Router => {
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
  router.get(`${PATH}/client/:client`, (req, res, next) =>
    controller.getByClientId(req, res, next),
  );
  router.get(`${PATH}/order/:order`, (req, res, next) =>
    controller.getByOrderId(req, res, next),
  );

  return router;
};
