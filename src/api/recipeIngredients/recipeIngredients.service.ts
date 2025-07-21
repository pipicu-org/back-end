import { IRecipeIngredientsRepository } from './recipeIngredients.repository';

export interface IRecipeIngredientService {
  getKitchenBoard(page: number, limit: number): Promise<any>;
}

export class RecipeIngredientsService implements IRecipeIngredientService {
  constructor(
    private readonly _recipeIngredientsRepository: IRecipeIngredientsRepository,
  ) {}

  async getKitchenBoard(page: number, limit: number): Promise<any> {
    return this._recipeIngredientsRepository.getKitchenBoard(page, limit);
  }
}
