import { Router } from 'express';
import { stateController } from '../../config';

export const PATH = '/state';

export const stateRouter = (Controller = stateController): Router => {
  const router: Router = Router();
  router.post(`${PATH}`, (req, res, next) =>
    Controller.createState(req, res, next),
  );
  router.get(`${PATH}/:id`, (req, res, next) =>
    Controller.getStateById(req, res, next),
  );
  router.put(`${PATH}/:id`, (req, res, next) =>
    Controller.updateState(req, res, next),
  );
  router.delete(`${PATH}/:id`, (req, res, next) =>
    Controller.deleteState(req, res, next),
  );
  return router;
};
