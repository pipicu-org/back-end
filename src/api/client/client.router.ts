import { Router } from 'express';
import { clientController } from '../../config';

const PATH = '/client';

export const clientRouter = (controller = clientController): Router => {
  const router: Router = Router();

  router.post(`${PATH}`, (req, res, next) =>
    controller.createClient(req, res, next),
  );
  router.get(`${PATH}/:id`, async (req, res, next) => {
    controller.getClientById(req, res, next);
  });
  router.put(`${PATH}/:id`, (req, res, next) => {
    controller.updateClient(req, res, next);
  });
  router.delete(`${PATH}/:id`, (req, res, next) => {
    controller.deleteClient(req, res, next);
  });
  router.get(`${PATH}`, (req, res, next) => {
    controller.searchClients(req, res, next);
  });

  return router;
};
