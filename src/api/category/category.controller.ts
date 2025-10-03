import { NextFunction, Request, Response } from 'express';
import { ICategoryService } from './category.service';
import { CategoryRequestDTO } from '../models/DTO/request/categoryRequestDTO';

export class CategoryController {
  constructor(private readonly categoryService: ICategoryService) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const categoryRequestDTO = req.body as CategoryRequestDTO;
      const category = await this.categoryService.create(categoryRequestDTO);
      res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await this.categoryService.findAll();
      res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).send('Invalid category ID');
        return;
      }
      const category = await this.categoryService.findById(id);
      res.status(200).json(category);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const categoryRequestDTO = req.body as CategoryRequestDTO;
      const updatedCategory = await this.categoryService.update(
        Number(req.params.id),
        categoryRequestDTO,
      );
      res.status(200).json(updatedCategory);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await this.categoryService.delete(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
