export class RecipeIngredientsResponseDTO {
  page: number;
  limit: number;
  total: number;
  orderId: number;
  product: {
    id: number;
    name: string;
  };
  ingredients: Array<{
    id: number;
    name: string;
    quantity: number;
  }>;

  constructor(
    page: number,
    limit: number,
    total: number,
    orderId: number,
    product: { id: number; name: string },
    ingredients: Array<{ id: number; name: string; quantity: number }>,
  ) {
    this.page = page;
    this.limit = limit;
    this.total = total;
    this.orderId = orderId;
    this.product = product;
    this.ingredients = ingredients;
  }
}
