import { RecipeIngredientResponseDTO } from '../models/DTO/response/recipeIngredientResponseDTO';
import { IRecipeIngredientRepository } from './recipeIngredient.repository';
import { IRecipeIngredientService } from './recipeIngredient.service';

export class RecipeIngredientService implements IRecipeIngredientService {
  constructor(
    private readonly _recipeIngredientRepository: IRecipeIngredientRepository,
  ) {}

  async getKitchenBoard(
    page: number,
    limit: number,
  ): Promise<RecipeIngredientResponseDTO> {
    try {
      return await this._recipeIngredientRepository.getKitchenBoard(
        page,
        limit,
      );
    } catch (error: any) {
      console.error('Error fetching kitchen board:', error);
      throw error;
    }
  }
}