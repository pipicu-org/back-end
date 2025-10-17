import { Request, Response, NextFunction } from 'express';
import { IProductService } from './product.service';
import { ProductRequestDTO } from '../models/DTO/request/productRequestDTO';
import { CustomProductRequestDTO } from '../models/DTO/request/customProductRequestDTO';

export class ProductController {
  constructor(private readonly _productService: IProductService) {}
  async searchProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const search = req.query.search;
      const parsedSearch = !search ? '' : (search as string);
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const findAndCount = await this._productService.getByName(
        parsedSearch,
        page,
        limit,
      );
      res.status(200).json(findAndCount);
    } catch (error: any) {
      next(error);
    }
  }

  async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const product = await this._productService.getProductById(id);
      if (product) {
        res.status(200).json(product);
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error: any) {
      next(error);
    }
  }

  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const productRequestDTO = req.body as unknown as ProductRequestDTO;
      const product =
        await this._productService.createProduct(productRequestDTO);
      res.status(201).json(product);
    } catch (error: any) {
      next(error);
    }
  }
  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const productRequestDTO = req.body;
      const updatedProduct = await this._productService.updateProduct(
        id,
        productRequestDTO,
      );
      if (updatedProduct) {
        res.status(200).json(updatedProduct);
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error: any) {
      next(error);
    }
  }

  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const deletedProduct = await this._productService.deleteProduct(id);
      if (deletedProduct) {
        res.status(200).json(deletedProduct);
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error: any) {
      next(error);
    }
  }

  async getProductsByCategoryId(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const categoryId = Number(req.params.categoryId);
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const products = await this._productService.getProductsByCategoryId(
        categoryId,
        page,
        limit,
      );
      res.status(200).json(products);
    } catch (error: any) {
      next(error);
    }
  }

  async createCustomProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const customProductRequestDTO =
        req.body as unknown as CustomProductRequestDTO;
      const product = await this._productService.createCustomProduct(
        customProductRequestDTO,
      );
      res.status(201).json(product);
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Retrieves a custom product by its ID.
   * @param req Express request object containing the custom product ID in params.
   * @param res Express response object.
   * @param next Express next function for error handling.
   */
  async getCustomProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const product = await this._productService.getCustomProductById(id);
      if (product) {
        res.status(200).json(product);
      } else {
        res.status(404).json({ message: 'Custom product not found' });
      }
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Retrieves all custom products with pagination.
   * @param req Express request object containing pagination query parameters.
   * @param res Express response object.
   * @param next Express next function for error handling.
   */
  async getAllCustomProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.params.page) || 1;
      const limit = Number(req.params.limit) || 10;
      const products = await this._productService.getAllCustomProducts(
        page,
        limit,
      );
      res.status(200).json(products);
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Updates a custom product by its ID.
   * @param req Express request object containing the custom product ID in params and update data in body.
   * @param res Express response object.
   * @param next Express next function for error handling.
   */
  async updateProductCustom(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const customProductRequestDTO =
        req.body as unknown as CustomProductRequestDTO;
      const updatedProduct = await this._productService.updateProductCustom(
        id,
        customProductRequestDTO,
      );
      if (updatedProduct) {
        res.status(200).json(updatedProduct);
      } else {
        res.status(404).json({ message: 'Custom product not found' });
      }
    } catch (error: any) {
      next(error);
    }
  }
}
