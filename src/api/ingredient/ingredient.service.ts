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
  getIngredientById(id: number): Promise<IngredientResponseDTO | null>;
  searchIngredients(
    search: string,
    page: number,
    limit: number,
  ): Promise<IngredientSearchResponseDTO | []>;
  updateIngredient(
    id: number,
    requestDTO: IngredientRequestDTO,
  ): Promise<IngredientResponseDTO | null>;
  deleteIngredient(id: number): Promise<IngredientResponseDTO | null>;
}

export class IngredientService implements IIngredientService {
  constructor(
    private readonly repository: IIngredientRepository = ingredientRepository,
    private readonly _ingredientMapper: IngredientMapper,
  ) {}

  async createIngredient(
    requestDTO: IngredientRequestDTO,
  ): Promise<IngredientResponseDTO> {
    try {
      const ingredient = this._ingredientMapper.requestDTOToEntity(requestDTO);
      const createdIngredient = await this.repository.create(ingredient);
      return this._ingredientMapper.toResponseDTO(createdIngredient);
    } catch (error) {
      throw new Error(`Error creating ingredient: ${error}`);
    }
  }

  async getIngredientById(id: number): Promise<IngredientResponseDTO | null> {
    try {
      const ingredient = await this.repository.findById(id);
      if (!ingredient) {
        return null;
      }
      return new IngredientResponseDTO(ingredient);
    } catch (error) {
      throw new Error(`Error fetching ingredient by ID: ${error}`);
    }
  }

  async searchIngredients(
    search: string,
    page: number,
    limit: number,
  ): Promise<IngredientSearchResponseDTO | []> {
    try {
      const results = await this.repository.searchIngredient(
        search,
        page,
        limit,
      );
      return Array.isArray(results) ? results : [];
    } catch (error) {
      throw new Error(`Error fetching all ingredients: ${error}`);
    }
  }

  async updateIngredient(
    id: number,
    requestDTO: IngredientRequestDTO,
  ): Promise<IngredientResponseDTO | null> {
    try {
      const updatedIngredient =
        this._ingredientMapper.requestDTOToEntity(requestDTO);
      const ingredient = await this.repository.update(id, updatedIngredient);
      if (!ingredient) {
        return null;
      }
      return new IngredientResponseDTO(ingredient);
    } catch (error) {
      throw new Error(`Error updating ingredient: ${error}`);
    }
  }

  async deleteIngredient(id: number): Promise<IngredientResponseDTO | null> {
    try {
      const ingredient = await this.repository.delete(id);
      if (!ingredient) {
        return null;
      }
      return new IngredientResponseDTO(ingredient);
    } catch (error) {
      throw new Error(`Error deleting ingredient: ${error}`);
    }
  }
}
