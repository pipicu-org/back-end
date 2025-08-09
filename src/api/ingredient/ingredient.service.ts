import { ingredientRepository } from '../../config';
import { IngredientRequestDTO } from '../models/DTO/request/ingredientRequestDTO';
import { IngredientResponseDTO } from '../models/DTO/response/ingredientResponseDTO';
import { IngredientSearchResponseDTO } from '../models/DTO/response/ingredientSearchResponseDTO';
import { IngredientMapper } from '../models/mappers/ingredientMapper';
import { IIngredientRepository } from './ingredient.repository';

export interface IIngredientService {
  createIngredient(
    requestDTO: IngredientRequestDTO,
  ): Promise<IngredientResponseDTO>;
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
  ): Promise<IngredientResponseDTO> {
    try {
      const ingredient = this._ingredientMapper.requestDTOToEntity(requestDTO);
      const createdIngredient = await this._repository.create(ingredient);
      if (!createdIngredient) {
        throw new Error('Ingredient creation failed');
      }
      return createdIngredient;
    } catch (error) {
      throw new Error(`Error creating ingredient: ${error}`);
    }
  }

  async getIngredientById(id: number): Promise<IngredientResponseDTO | void> {
    try {
      const ingredient = await this._repository.findById(id);
      if (!ingredient) {
        throw new Error(`Ingredient with id ${id} not found`);
      }
      return ingredient;
    } catch (error) {
      throw new Error(`Error fetching ingredient by ID: ${error}`);
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
      throw new Error(`Error fetching all ingredients: ${error}`);
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
      if (!ingredient) {
        throw new Error(`Ingredient with id ${id} not found`);
      }
      return ingredient;
    } catch (error) {
      throw new Error(`Error updating ingredient: ${error}`);
    }
  }

  async deleteIngredient(id: number): Promise<IngredientResponseDTO | void> {
    try {
      const ingredient = await this._repository.findById(id);
      if (!ingredient) {
        throw new Error(`Ingredient with id ${id} not found`);
      }
      await this._repository.delete(id);
      const responseDTO = ingredient;
      return responseDTO;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error deleting ingredient: ${error.message}`);
      } else {
        throw new Error(`Error deleting ingredient: ${String(error)}`);
      }
    }
  }
}
