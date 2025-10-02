export interface IIngredientService {
  createIngredient(
    requestDTO: import('../models/DTO/request/ingredientRequestDTO').IngredientRequestDTO,
  ): Promise<import('../models/DTO/response/ingredientResponseDTO').IngredientResponseDTO | void>;
  getIngredientById(id: number): Promise<import('../models/DTO/response/ingredientResponseDTO').IngredientResponseDTO | void>;
  searchIngredients(
    search: string,
    page: number,
    limit: number,
  ): Promise<import('../models/DTO/response/ingredientSearchResponseDTO').IngredientSearchResponseDTO | void>;
  updateIngredient(
    id: number,
    requestDTO: import('../models/DTO/request/ingredientRequestDTO').IngredientRequestDTO,
  ): Promise<import('../models/DTO/response/ingredientResponseDTO').IngredientResponseDTO | void>;
  deleteIngredient(id: number): Promise<import('../models/DTO/response/ingredientResponseDTO').IngredientResponseDTO | void>;
}
