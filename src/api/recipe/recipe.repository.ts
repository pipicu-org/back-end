import { Repository } from 'typeorm';
import { Recipe } from '../models';

export interface IRecipeRepository {
  findAll(): Promise<Recipe[]>;
  findById(id: number): Promise<Recipe | null>;
  create(recipe: Recipe): Promise<Recipe>;
  update(id: number, recipe: Recipe): Promise<Recipe | null>;
  delete(id: number): Promise<Recipe | void>;
}

export class RecipeRepository implements IRecipeRepository {
  constructor(private readonly dbRecipeRepository: Repository<Recipe>) {}

  async findAll(): Promise<Recipe[]> {
    try {
      return await this.dbRecipeRepository.find();
    } catch (error) {
      console.error('Error fetching all recipes:', error);
      return [];
    }
  }

  async findById(id: number): Promise<Recipe | null> {
    try {
      return await this.dbRecipeRepository.findOneBy({ id });
    } catch (error) {
      console.error(`Error fetching recipe with id ${id}:`, error);
      return null;
    }
  }

  async create(recipe: Recipe): Promise<Recipe> {
    try {
      return await this.dbRecipeRepository.save(recipe);
    } catch (error) {
      console.error('Error creating recipe:', error);
      throw new Error('Could not create recipe');
    }
  }

  async update(id: number, recipe: Recipe): Promise<Recipe | null> {
    try {
      const existingRecipe = await this.dbRecipeRepository.update(id, recipe);
      if (existingRecipe.affected === 0) {
        console.warn(`No recipe found with id ${id} to update`);
        return null;
      }
      return await this.dbRecipeRepository.findOneBy({ id });
    } catch (error) {
      console.error(`Error updating recipe with id ${id}:`, error);
      return null;
    }
  }

  async delete(id: number): Promise<Recipe | void> {
    try {
      const existingRecipe = await this.dbRecipeRepository.findOneBy({ id });
      if (existingRecipe) {
        await this.dbRecipeRepository.delete(id);
      } else {
        console.warn(`No recipe found with id ${id} to delete`);
      }
    } catch (error) {
      console.error(`Error deleting recipe with id ${id}:`, error);
      throw new Error('Could not delete recipe');
    }
  }
}
