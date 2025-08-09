import { Repository } from 'typeorm';
import { Category } from '../models/entity';

export interface ICategoryRepository {
  findById(id: number): Promise<Category | void>;
}

export class CategoryRepository implements ICategoryRepository {
  constructor(private readonly dbCategoryRepository: Repository<Category>) {}

  async findById(id: number): Promise<Category | void> {
    try {
      const category = await this.dbCategoryRepository.findOneBy({ id });
      if (!category) {
        throw new Error(`Category with id ${id} not found`);
      }
      return category;
    } catch (error) {
      console.error(`Error finding category with id ${id}:`, error);
      throw new Error(`Failed to find category with id ${id}`);
    }
  }
}
