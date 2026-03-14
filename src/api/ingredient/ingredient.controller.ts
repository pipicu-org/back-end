import { Request, Response, NextFunction } from 'express';
import { IIngredientService } from './ingredient.service';
import { IngredientRequestDTO } from '../models/DTO/request/ingredientRequestDTO';
import { ingredientService } from '../../config/inject';

export class IngredientController {
  constructor(
    private readonly ingredientService: IIngredientService = ingredientService,
  ) {}
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const ingredientRequestDTO = req.body as unknown as IngredientRequestDTO;
      const ingredient =
        await this.ingredientService.createIngredient(ingredientRequestDTO);
      res.status(201).json(ingredient);
    } catch (error: any) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        throw new Error('Invalid ingredient ID');
      }
      const ingredient = await this.ingredientService.getIngredientById(id);
      if (ingredient) {
        res.status(200).json(ingredient);
      } else {
        res.status(404).json({ message: 'Ingredient not found' });
      }
    } catch (error: any) {
      next(error);
    }
  }

  async searchIngredients(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, page = 1, limit = 10 } = req.query;
      const parsedSearch = !search ? '' : String(search);
      const ingredients = await this.ingredientService.searchIngredients(
        parsedSearch,
        Number(page),
        Number(limit),
      );
      res.status(200).json(ingredients);
    } catch (error: any) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        throw new Error('Invalid ingredient ID');
      }
      const ingredientRequestDTO = req.body as unknown as IngredientRequestDTO;
      const updatedIngredient = await this.ingredientService.updateIngredient(
        id,
        ingredientRequestDTO,
      );
      if (updatedIngredient) {
        res.status(200).json(updatedIngredient);
      } else {
        res.status(404).json({ message: 'Ingredient not found' });
      }
    } catch (error: any) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const deletedIngredient =
        await this.ingredientService.deleteIngredient(id);
      if (deletedIngredient) {
        res.status(200).json(deletedIngredient);
      } else {
        res.status(404).json({ message: 'Ingredient not found' });
      }
    } catch (error: any) {
      next(error);
    }
  }

  async downloadTemplate(req: Request, res: Response, next: NextFunction) {
    try {
      const buffer = await this.ingredientService.downloadTemplate();
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=ingredient_template.xlsx');
      res.send(buffer);
    } catch (error: any) {
      next(error);
    }
  }

  async uploadExcel(req: Request, res: Response, next: NextFunction) {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ message: 'No se proporcionó ningún archivo' });
      }
      const ingredients = await this.ingredientService.uploadFromExcel(file);
      res.status(201).json(ingredients);
    } catch (error: any) {
      next(error);
    }
  }
}
