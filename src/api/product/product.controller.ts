import { Request, Response, NextFunction } from 'express';
import { IProductService } from './product.service';
import { ProductRequestDTO } from '../models/DTO/request/productRequestDTO';

export class ProductController {
  constructor(private readonly _productService: IProductService) {}
  async searchProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const search = req.query.search;
      const parsedSearch = !search ? '' : search as string;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const findAndCount = await this._productService.getByName(
        parsedSearch,
        page,
        limit,
      );
      res.status(200).json(findAndCount);
    } catch (error) {
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
    } catch (error) {
      next(error);
    }
  }

  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const productRequestDTO = req.body as unknown as ProductRequestDTO;
      const product =
        await this._productService.createProduct(productRequestDTO);
      res.status(201).json(product);
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
      next(error);
    }
  }
}
