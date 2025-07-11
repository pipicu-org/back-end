const PATH = '/products';

import { Router } from 'express';
import { productController } from '../../config';

export const productRouter = (controller = productController): Router => {
  const router = Router();
  router.get(`${PATH}`, (req, res, next) =>
    controller.searchProducts(req, res, next),
  );
  router.get(`${PATH}/:id`, (req, res, next) =>
    controller.getProductById(req, res, next),
  );
  router.post(`${PATH}`, (req, res, next) =>
    controller.createProduct(req, res, next),
  );
  router.patch(`${PATH}/:id`, (req, res, next) =>
    controller.updateProduct(req, res, next),
  );
  router.delete(`${PATH}/:id`, (req, res, next) =>
    controller.deleteProduct(req, res, next),
  );
  router.get(`${PATH}/category/:categoryId`, (req, res, next) =>
    controller.getProductsByCategoryId(req, res, next),
  );
  return router;
};
