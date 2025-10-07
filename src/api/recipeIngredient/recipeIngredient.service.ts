export interface IRecipeIngredientService {
  getKitchenBoard(page: number, limit: number): Promise<import('../models/DTO/response/recipeIngredientResponseDTO').RecipeIngredientResponseDTO>;
}
