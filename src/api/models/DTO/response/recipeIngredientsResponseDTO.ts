export class RecipeIngredientsResponseDTO {
  page: number;
  limit: number;
  total: number;
  data: Array<{
    product: { id: number; name: string };
    orderId: number;
    ingredientsIds: number[];
    ingredientsNames: string[];
  }>;

  constructor(
    page: number,
    limit: number,
    total: number,
    data: Array<{
      product: { id: number; name: string };
      orderId: number;
      ingredientsIds: number[];
      ingredientsNames: string[];
    }>,
  ) {
    this.page = page;
    this.limit = limit;
    this.total = total;
    this.data = data;
  }
}
