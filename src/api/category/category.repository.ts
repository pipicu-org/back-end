import { Repository } from 'typeorm';
import { Category } from '../models/entity';
import { HttpError } from '../../errors/httpError';

export interface ICategoryRepository {
  findById(id: number): Promise<Category>;
  findAll(): Promise<Category[]>;
  create(category: Category): Promise<Category>;
  update(id: number, category: Partial<Category>): Promise<Category>;
  delete(id: number): Promise<void>;
}

export class CategoryRepository implements ICategoryRepository {
  constructor(private readonly dbCategoryRepository: Repository<Category>) {}

  async findById(id: number): Promise<Category> {
    try {
      const category = await this.dbCategoryRepository.findOneBy({ id });
      if (!category) {
        throw new HttpError(404, `Category with id ${id} not found`);
      }
      return category;
    } catch (error: any) {
      console.error(`Error finding category with id ${id}:`, error);
      throw new HttpError(
        error.state || 500,
        error.message || 'Failed to find category by ID',
      );
    }
  }

  async findAll(): Promise<Category[]> {
    try {
      return await this.dbCategoryRepository.find();
    } catch (error: any) {
      console.error('Error finding all categories:', error);
      throw new HttpError(
        error.state || 500,
        error.message || 'Failed to find categories',
      );
    }
  }

  async create(category: Category): Promise<Category> {
    try {
      const newCategory = this.dbCategoryRepository.create(category);
      return await this.dbCategoryRepository.save(newCategory);
    } catch (error: any) {
      console.error('Error creating category:', error);
      throw new HttpError(
        error.state || 500,
        error.message || 'Failed to create category',
      );
    }
  }

  async update(id: number, category: Partial<Category>): Promise<Category> {
    try {
      await this.dbCategoryRepository.update(id, category);
      const updatedCategory = await this.findById(id);
      return updatedCategory;
    } catch (error: any) {
      console.error(`Error updating category with id ${id}:`, error);
      throw new HttpError(
        error.state || 500,
        error.message || 'Failed to update category',
      );
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const category = await this.findById(id);
      await this.dbCategoryRepository.remove(category);
    } catch (error: any) {
      console.error(`Error deleting category with id ${id}:`, error);
      throw new HttpError(
        error.state || 500,
        error.message || 'Failed to delete category',
      );
    }
  }
}
