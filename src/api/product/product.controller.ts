import { Request, Response, NextFunction } from 'express';
import { IProductService } from './product.service';

export class ProductController {
  constructor(private readonly productService: IProductService) {}
  async getAllProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await this.productService.getAllProducts();
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  }

  async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const product = await this.productService.getProductById(id);
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
      const productRequestDTO = req.body;
      const product =
        await this.productService.createProduct(productRequestDTO);
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  }
  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const productRequestDTO = req.body;
      const updatedProduct = await this.productService.updateProduct(
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
      const deletedProduct = await this.productService.deleteProduct(id);
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
      const products =
        await this.productService.getProductsByCategoryId(categoryId);
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  }
}
