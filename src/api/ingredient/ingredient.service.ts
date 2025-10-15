import { IngredientRequestDTO } from '../models/DTO/request/ingredientRequestDTO';
import { IngredientResponseDTO } from '../models/DTO/response/ingredientResponseDTO';
import { IngredientSearchResponseDTO } from '../models/DTO/response/ingredientSearchResponseDTO';
import { Unit } from '../models/entity';

export interface IIngredientService {
  createIngredient(
    requestDTO: IngredientRequestDTO,
  ): Promise<IngredientResponseDTO | void>;
  getIngredientById(id: number): Promise<IngredientResponseDTO | void>;
  searchIngredients(
    search: string,
    page: number,
    limit: number,
  ): Promise<IngredientSearchResponseDTO | void>;
  updateIngredient(
    id: number,
    requestDTO: import('../models/DTO/request/ingredientRequestDTO').IngredientRequestDTO,
  ): Promise<IngredientResponseDTO | void>;
  deleteIngredient(id: number): Promise<IngredientResponseDTO | void>;
  getAllUnits(): Promise<Unit[] | void>;
}
