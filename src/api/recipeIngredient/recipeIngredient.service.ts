import { RecipeIngredientResponseDTO } from "../models/DTO/response/recipeIngredientResponseDTO";

export interface IRecipeIngredientService {
  getKitchenBoard(page: number, limit: number): Promise<RecipeIngredientResponseDTO>;
}
