import { ingredientRepository } from '../../config';
import { IngredientRequestDTO } from '../models/DTO/request/ingredientRequestDTO';
import { IngredientResponseDTO } from '../models/DTO/response/ingredientResponseDTO';
import { IngredientSearchResponseDTO } from '../models/DTO/response/ingredientSearchResponseDTO';
import { IngredientMapper } from '../models/mappers/ingredientMapper';
import { IIngredientRepository } from './ingredient.repository';

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
    requestDTO: IngredientRequestDTO,
  ): Promise<IngredientResponseDTO | void>;
  deleteIngredient(id: number): Promise<IngredientResponseDTO | void>;
}

export class IngredientService implements IIngredientService {
  constructor(
    private readonly _repository: IIngredientRepository = ingredientRepository,
    private readonly _ingredientMapper: IngredientMapper,
  ) {}

  async createIngredient(
    requestDTO: IngredientRequestDTO,
  ): Promise<IngredientResponseDTO | void> {
    try {
      const ingredient = this._ingredientMapper.requestDTOToEntity(requestDTO);
      const createdIngredient = await this._repository.create(ingredient);
      return createdIngredient;
    } catch (error) {
      console.error('Error creating ingredient:', error);
      throw error;
    }
  }

  async getIngredientById(id: number): Promise<IngredientResponseDTO | void> {
    try {
      const ingredient = await this._repository.findById(id);
      return ingredient;
    } catch (error) {
      console.log(`Error fetching ingredient with id ${id}:`, error);
      throw error;
    }
  }

  async searchIngredients(
    search: string,
    page: number,
    limit: number,
  ): Promise<IngredientSearchResponseDTO | void> {
    try {
      return await this._repository.searchIngredient(search, page, limit);
    } catch (error) {
      console.error('Error searching ingredients:', error);
      throw error;
    }
  }

  async updateIngredient(
    id: number,
    requestDTO: IngredientRequestDTO,
  ): Promise<IngredientResponseDTO | void> {
    try {
      const updatedIngredient =
        this._ingredientMapper.requestDTOToEntity(requestDTO);
      const ingredient = await this._repository.update(id, updatedIngredient);
      return ingredient;
    } catch (error) {
      console.error(`Error updating ingredient with id ${id}:`, error);
      throw error;
    }
  }

  async deleteIngredient(id: number): Promise<IngredientResponseDTO | void> {
    try {
      const ingredient = await this._repository.findById(id);
      await this._repository.delete(id);
      return ingredient;
    } catch (error) {
      console.error(`Error deleting ingredient with id ${id}:`, error);
      throw error;
    }
  }
}
