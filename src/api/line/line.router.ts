import { Router } from 'express';
import { lineController } from '../../config';

const PATH = '/preparations';

export const lineRouter = (controller = lineController): Router => {
  const router: Router = Router();

  router.patch(`${PATH}/kitchen`, (req, res, next) =>
    controller.changeStateLine(req, res, next),
  );

  router.get(`${PATH}/:id`, (req, res, next) =>
    controller.findById(req, res, next),
  );

  router.get(`${PATH}/state/:stateId`, (req, res, next) =>
    controller.getLinesByState(req, res, next),
  );

  return router;
};
