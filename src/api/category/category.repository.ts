import { Repository } from 'typeorm';
import { Category } from '../models/entity';

export interface ICategoryRepository {
  findById(id: number): Promise<Category | null>;
  findByName(name: string): Promise<Category | null>;
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

  async findByName(name: string): Promise<Category | null> {
    try {
      return await this.dbCategoryRepository.findOneBy({ name });
    } catch (error) {
      console.error(`Error finding category with name ${name}:`, error);
      return null;
    }
  }
}
