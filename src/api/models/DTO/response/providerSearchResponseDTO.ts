export class ProviderSearchResponseDTO {
  search: string;
  total: number;
  page: number;
  limit: number;
  data: Array<{
    id: string;
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
  }>;

  constructor(
    search: string,
    total: number,
    page: number,
    limit: number,
    data: Array<{
      id: string;
      name: string;
      description?: string;
      createdAt: Date;
      updatedAt: Date;
    }>,
  ) {
    this.search = search;
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.data = data;
  }
}