import { NextFunction, Request, Response } from 'express';
import { IRecipeIngredientService } from './recipeIngredient.service';

export class RecipeIngredientController {
  constructor(
    private readonly _recipeIngredientService: IRecipeIngredientService,
  ) {}

  async getKitchenBoard(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { page, limit } = req.query;
    try {
      const result = await this._recipeIngredientService.getKitchenBoard(
        Number(page) || 1,
        Number(limit) || 10,
      );
      res.status(200).json(result);
    } catch (error: any) {
      next(error);
    }
  }
}
