import { Repository } from 'typeorm';
import { Ingredient } from '../models/entity';
import { IngredientSearchResponseDTO } from '../models/DTO/response/ingredientSearchResponseDTO';
import { IngredientMapper } from '../models/mappers/ingredientMapper';

export interface IIngredientRepository {
  searchIngredient(
    search: string,
    page: number,
    limit: number,
  ): Promise<IngredientSearchResponseDTO | []>;
  findById(id: number): Promise<Ingredient | null>;
  create(ingredient: Ingredient): Promise<Ingredient>;
  update(id: number, ingredient: Ingredient): Promise<Ingredient | null>;
  delete(id: number): Promise<Ingredient | void>;
}

export class IngredientRepository implements IIngredientRepository {
  constructor(
    private readonly dbIngredientRepository: Repository<Ingredient>,
    private readonly _ingredientMapper: IngredientMapper,
  ) {}

  async searchIngredient(
    search: string,
    page: number,
    limit: number,
  ): Promise<IngredientSearchResponseDTO | []> {
    try {
      const results = await this.dbIngredientRepository
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
      return [];
    }
  }

  async findById(id: number): Promise<Ingredient | null> {
    try {
      return await this.dbIngredientRepository.findOneBy({ id });
    } catch (error) {
      console.error(`Error fetching ingredient with id ${id}:`, error);
      return null;
    }
  }

  async create(ingredient: Ingredient): Promise<Ingredient> {
    try {
      return await this.dbIngredientRepository.save(ingredient);
    } catch (error) {
      console.error('Error creating ingredient:', error);
      throw new Error('Could not create ingredient');
    }
  }

  async update(id: number, ingredient: Ingredient): Promise<Ingredient | null> {
    try {
      const existingIngredient = await this.dbIngredientRepository.update(
        id,
        ingredient,
      );
      if (existingIngredient.affected === 0) {
        console.warn(`No ingredient found with id ${id} to update`);
        return null;
      }
      return await this.dbIngredientRepository.findOneBy({ id });
    } catch (error) {
      console.error(`Error updating ingredient with id ${id}:`, error);
      return null;
    }
  }

  async delete(id: number): Promise<Ingredient | void> {
    try {
      const existingIngredient = await this.dbIngredientRepository.findOneBy({
        id,
      });
      if (existingIngredient) {
        await this.dbIngredientRepository.delete(id);
      } else {
        console.warn(`No ingredient found with id ${id} to delete`);
      }
    } catch (error) {
      console.error(`Error deleting ingredient with id ${id}:`, error);
    }
  }
}
