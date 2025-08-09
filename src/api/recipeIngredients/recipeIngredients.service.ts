import { RecipeIngredientsResponseDTO } from '../models/DTO/response/recipeIngredientsResponseDTO';
import { IRecipeIngredientsRepository } from './recipeIngredients.repository';

export interface IRecipeIngredientService {
  getKitchenBoard(
    page: number,
    limit: number,
  ): Promise<RecipeIngredientsResponseDTO>;
}

export class RecipeIngredientsService implements IRecipeIngredientService {
  constructor(
    private readonly _recipeIngredientsRepository: IRecipeIngredientsRepository,
  ) {}

  async getKitchenBoard(
    page: number,
    limit: number,
  ): Promise<RecipeIngredientsResponseDTO> {
    return this._recipeIngredientsRepository.getKitchenBoard(page, limit);
  }
}
