import { IngredientRequestDTO } from '../models/DTO/request/ingredientRequestDTO';
import { IngredientResponseDTO } from '../models/DTO/response/ingredientResponseDTO';
import { IngredientSearchResponseDTO } from '../models/DTO/response/ingredientSearchResponseDTO';
import { IngredientMapper } from '../models/mappers/ingredientMapper';
import { IIngredientRepository } from './ingredient.repository';
import { IIngredientService } from './ingredient.service';
import logger from '../../config/logger';
import { Unit } from '../models/entity';

export class IngredientService implements IIngredientService {
  constructor(
    private readonly _repository: IIngredientRepository,
    private readonly _ingredientMapper: IngredientMapper,
  ) {}

  async createIngredient(
    requestDTO: IngredientRequestDTO,
  ): Promise<IngredientResponseDTO | void> {
    try {
      const ingredient = this._ingredientMapper.requestDTOToEntity(requestDTO);
      const createdIngredient = await this._repository.create(ingredient);
      return createdIngredient;
    } catch (error: any) {
      logger.error('Error creating ingredient', {
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async getIngredientById(id: number): Promise<IngredientResponseDTO | void> {
    try {
      const ingredient = await this._repository.findById(id);
      return ingredient;
    } catch (error: any) {
      logger.error('Error fetching ingredient by ID', {
        id,
        error: error.message,
        stack: error.stack,
      });
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
    } catch (error: any) {
      logger.error('Error searching ingredients', {
        search,
        page,
        limit,
        error: error.message,
        stack: error.stack,
      });
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
    } catch (error: any) {
      logger.error('Error updating ingredient', {
        id,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async deleteIngredient(id: number): Promise<IngredientResponseDTO | void> {
    try {
      const ingredient = await this._repository.findById(id);
      await this._repository.delete(id);
      return ingredient;
    } catch (error: any) {
      logger.error('Error deleting ingredient', {
        id,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async getAllUnits(): Promise<Unit[] | void> {
    try {
      return await this._repository.getAllUnits();
    } catch (error: any) {
      logger.error('Error fetching all units', {
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }
}
