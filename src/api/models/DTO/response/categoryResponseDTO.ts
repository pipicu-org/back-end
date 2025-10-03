import { Category } from '../../entity/category';

export class CategoryResponseDTO {
  id: number;
  name: string;

  constructor(category: Category) {
    this.id = category.id;
    this.name = category.name;
  }
}