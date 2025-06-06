import { Request, Response, NextFunction } from 'express';
import { IRecipeService } from './recipe.service';
import { RecipeRequestDTO } from '../models/DTO/request/recipeRequestDTO';

export class RecipeController {
  constructor(private readonly recipeService: IRecipeService = recipeService) {}
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const recipeRequestDTO = req.body as unknown as RecipeRequestDTO;
      const recipe = await this.recipeService.create(recipeRequestDTO);
      if (!recipe) {
        throw new Error('Recipe creation failed');
      }
      res.status(201).json(recipe);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        throw new Error('Invalid recipe ID');
      }
      const recipe = await this.recipeService.findById(id);
      if (recipe) {
        res.status(200).json(recipe);
      } else {
        res.status(404).json({ message: 'Recipe not found' });
      }
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const recipes = await this.recipeService.findAll();
      res.status(200).json(recipes);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        throw new Error('Invalid recipe ID');
      }
      const recipeRequestDTO = req.body as unknown as RecipeRequestDTO;
      const updatedRecipe = await this.recipeService.update(
        id,
        recipeRequestDTO,
      );
      if (updatedRecipe) {
        res.status(200).json(updatedRecipe);
      } else {
        res.status(404).json({ message: 'Recipe not found' });
      }
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        throw new Error('Invalid recipe ID');
      }
      const deletedRecipe = await this.recipeService.delete(id);
      if (deletedRecipe) {
        res.status(200).json(deletedRecipe);
      } else {
        res.status(404).json({ message: 'Recipe not found' });
      }
    } catch (error) {
      next(error);
    }
  }
}
