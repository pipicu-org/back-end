import { Category } from '../models/entity';
import { CategoryRequestDTO } from '../models/DTO/request/categoryRequestDTO';
import { CategoryResponseDTO } from '../models/DTO/response/categoryResponseDTO';
import { ICategoryRepository } from './category.repository';
import { ICategoryService } from './category.service';

export class CategoryService implements ICategoryService {
  constructor(private readonly _categoryRepository: ICategoryRepository) {}

  async create(categoryRequest: CategoryRequestDTO): Promise<CategoryResponseDTO> {
    const category = new Category();
    category.name = categoryRequest.name;
    const createdCategory = await this._categoryRepository.create(category);
    return new CategoryResponseDTO(createdCategory);
  }

  async findAll(): Promise<CategoryResponseDTO[]> {
    const categories = await this._categoryRepository.findAll();
    return categories.map(category => new CategoryResponseDTO(category));
  }

  async findById(id: number): Promise<CategoryResponseDTO> {
    const category = await this._categoryRepository.findById(id);
    return new CategoryResponseDTO(category);
  }

  async update(id: number, categoryRequest: CategoryRequestDTO): Promise<CategoryResponseDTO> {
    const updatedCategory = await this._categoryRepository.update(id, { name: categoryRequest.name });
    return new CategoryResponseDTO(updatedCategory);
  }

  async delete(id: number): Promise<void> {
    await this._categoryRepository.delete(id);
  }
}