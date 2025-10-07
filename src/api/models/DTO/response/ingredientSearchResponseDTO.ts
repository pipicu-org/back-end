import { IngredientResponseDTO } from './ingredientResponseDTO';

export class IngredientSearchResponseDTO {
  search: string;
  total: number;
  page: number;
  limit: number;
  data: IngredientResponseDTO[];
  constructor(
    search: string,
    total: number,
    page: number,
    limit: number,
    data: IngredientResponseDTO[],
  ) {
    this.search = search;
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.data = data;
  }
}
