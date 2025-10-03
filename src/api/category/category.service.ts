import { CategoryRequestDTO } from '../models/DTO/request/categoryRequestDTO';
import { CategoryResponseDTO } from '../models/DTO/response/categoryResponseDTO';

export interface ICategoryService {
  create(category: CategoryRequestDTO): Promise<CategoryResponseDTO>;
  findAll(): Promise<CategoryResponseDTO[]>;
  findById(id: number): Promise<CategoryResponseDTO>;
  update(id: number, category: CategoryRequestDTO): Promise<CategoryResponseDTO>;
  delete(id: number): Promise<void>;
}