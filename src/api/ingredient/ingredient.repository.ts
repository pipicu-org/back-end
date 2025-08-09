import { Repository } from 'typeorm';
import { Ingredient } from '../models/entity';
import { IngredientSearchResponseDTO } from '../models/DTO/response/ingredientSearchResponseDTO';
import { IngredientMapper } from '../models/mappers/ingredientMapper';
import { IngredientResponseDTO } from '../models/DTO/response/ingredientResponseDTO';

export interface IIngredientRepository {
  searchIngredient(
    search: string,
    page: number,
    limit: number,
  ): Promise<IngredientSearchResponseDTO | void>;
  findById(id: number): Promise<IngredientResponseDTO | void>;
  create(ingredient: Ingredient): Promise<IngredientResponseDTO | void>;
  update(
    id: number,
    ingredient: Ingredient,
  ): Promise<IngredientResponseDTO | void>;
  delete(id: number): Promise<IngredientResponseDTO | void>;
}

export class IngredientRepository implements IIngredientRepository {
  constructor(
    private readonly _dbIngredientRepository: Repository<Ingredient>,
    private readonly _ingredientMapper: IngredientMapper,
  ) {}

  async searchIngredient(
    search: string,
    page: number,
    limit: number,
  ): Promise<IngredientSearchResponseDTO | void> {
    try {
      const results = await this._dbIngredientRepository
        .createQueryBuilder('ingredient')
        .where('ingredient.name LIKE :search', { search: `%${search}%` })
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();
      return this._ingredientMapper.createSearchToIngredientSearchDTO(
        results,
        search,
        page,
        limit,
      );
    } catch (error) {
      console.error('Error fetching all ingredients:', error);
      throw new Error('Could not fetch ingredients');
    }
  }

  async findById(id: number): Promise<IngredientResponseDTO | void> {
    try {
      const ingredient = await this._dbIngredientRepository.findOneBy({ id });
      if (!ingredient) {
        throw new Error(`Ingredient with id ${id} not found`);
      }
      return this._ingredientMapper.toResponseDTO(ingredient);
    } catch (error) {
      console.error(`Error fetching ingredient with id ${id}:`, error);
      throw new Error(`Could not fetch ingredient with id ${id}`);
    }
  }

  async create(ingredient: Ingredient): Promise<IngredientResponseDTO | void> {
    try {
      const createdIngredient =
        await this._dbIngredientRepository.save(ingredient);
      return this._ingredientMapper.toResponseDTO(createdIngredient);
    } catch (error) {
      console.error('Error creating ingredient:', error);
      throw new Error('Could not create ingredient');
    }
  }

  async update(
    id: number,
    ingredient: Ingredient,
  ): Promise<IngredientResponseDTO | void> {
    try {
      const existingIngredient = await this._dbIngredientRepository.update(
        id,
        ingredient,
      );
      if (existingIngredient.affected === 0) {
        throw new Error(`Ingredient with id ${id} not found`);
      }
      const updatedIngredient = await this._dbIngredientRepository
        .createQueryBuilder('ingredient')
        .where('ingredient.id = :id', { id })
        .getOne();
      if (!updatedIngredient) {
        throw new Error(`Ingredient with id ${id} not found after update`);
      }
      return this._ingredientMapper.toResponseDTO(updatedIngredient);
    } catch (error) {
      console.error(`Error updating ingredient with id ${id}:`, error);
      throw new Error(`Could not update ingredient with id ${id}`);
    }
  }

  async delete(id: number): Promise<IngredientResponseDTO | void> {
    try {
      const existingIngredient = await this._dbIngredientRepository.findOneBy({
        id,
      });
      if (existingIngredient) {
        await this._dbIngredientRepository.delete(id);
        return this._ingredientMapper.toResponseDTO(existingIngredient);
      } else {
        throw new Error(`Ingredient with id ${id} not found`);
      }
    } catch (error) {
      console.error(`Error deleting ingredient with id ${id}:`, error);
      throw new Error(`Could not delete ingredient with id ${id}`);
    }
  }
}
