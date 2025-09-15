import { Repository } from 'typeorm';
import { Category } from '../models/entity';
import { HttpError } from '../../errors/httpError';

export interface ICategoryRepository {
  findById(id: number): Promise<Category | void>;
}

export class CategoryRepository implements ICategoryRepository {
  constructor(private readonly dbCategoryRepository: Repository<Category>) {}

  async findById(id: number): Promise<Category | void> {
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
}
