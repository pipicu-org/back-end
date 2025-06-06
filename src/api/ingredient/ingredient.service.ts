import { ingredientFactory, ingredientRepository } from '../../config';
import { IngredientRequestDTO } from '../models/DTO/request/ingredientRequestDTO';
import { IngredientResponseDTO } from '../models/DTO/response/ingredientResponseDTO';
import { IIngredientRepository } from './ingredient.repository';

export interface IIngredientService {
  createIngredient(
    requestDTO: IngredientRequestDTO,
  ): Promise<IngredientResponseDTO>;
  getIngredientById(id: number): Promise<IngredientResponseDTO | null>;
  getAllIngredients(): Promise<IngredientResponseDTO[]>;
  updateIngredient(
    id: number,
    requestDTO: IngredientRequestDTO,
  ): Promise<IngredientResponseDTO | null>;
  deleteIngredient(id: number): Promise<IngredientResponseDTO | null>;
}

export class IngredientService implements IIngredientService {
  constructor(
    private readonly repository: IIngredientRepository = ingredientRepository,
  ) {}

  async createIngredient(
    requestDTO: IngredientRequestDTO,
  ): Promise<IngredientResponseDTO> {
    try {
      const ingredient =
        await ingredientFactory.createIngredientFromRequestDTO(requestDTO);
      const createdIngredient = await this.repository.create(ingredient);
      return new IngredientResponseDTO(createdIngredient);
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

  async getAllIngredients(): Promise<IngredientResponseDTO[]> {
    try {
      const ingredients = await this.repository.findAll();
      return ingredients.map(
        (ingredient) => new IngredientResponseDTO(ingredient),
      );
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
        await ingredientFactory.createIngredientFromRequestDTO(requestDTO);
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
