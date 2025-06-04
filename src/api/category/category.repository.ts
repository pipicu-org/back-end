import { Repository } from 'typeorm';
import { Category } from '../models';

export interface ICategoryRepository {
  findById(id: number): Promise<Category | null>;
}

export class CategoryRepository implements ICategoryRepository {
  constructor(private readonly dbCategoryRepository: Repository<Category>) {}

  async findById(id: number): Promise<Category | null> {
    try {
      return await this.dbCategoryRepository.findOneBy({ id });
    } catch (error) {
      console.error(`Error finding category with id ${id}:`, error);
      return null;
    }
  }
}
