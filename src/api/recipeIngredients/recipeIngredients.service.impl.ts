import { RecipeIngredientsResponseDTO } from '../models/DTO/response/recipeIngredientsResponseDTO';
import { IRecipeIngredientsRepository } from './recipeIngredients.repository';
import { IRecipeIngredientService } from './recipeIngredients.service';

export class RecipeIngredientsService implements IRecipeIngredientService {
  constructor(
    private readonly _recipeIngredientsRepository: IRecipeIngredientsRepository,
  ) {}

  async getKitchenBoard(
    page: number,
    limit: number,
  ): Promise<RecipeIngredientsResponseDTO> {
    try {
      return await this._recipeIngredientsRepository.getKitchenBoard(
        page,
        limit,
      );
    } catch (error: any) {
      console.error('Error fetching kitchen board:', error);
      throw error;
    }
  }
}