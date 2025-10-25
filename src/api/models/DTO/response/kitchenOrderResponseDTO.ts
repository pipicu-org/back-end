export class KitchenOrderItemDTO {
  orderId: number;
  lineId: number;
  preparationId: number;
  product: {
    id: number;
    name: string;
  };
  quantity: number;
  recipeIngredients: Array<{
    ingredientId: number;
    ingredientName: string;
    quantity: number;
    unitName: string;
  }>;

  constructor(
    orderId: number,
    lineId: number,
    preparationId: number,
    productId: number,
    productName: string,
    quantity: number,
    recipeIngredients: Array<{
      ingredientId: number;
      ingredientName: string;
      quantity: number;
      unitName: string;
    }>
  ) {
    this.orderId = orderId;
    this.lineId = lineId;
    this.preparationId = preparationId;
    this.product = {
      id: productId,
      name: productName,
    };
    this.quantity = quantity;
    this.recipeIngredients = recipeIngredients;
  }
}

export class KitchenOrderResponseDTO {
  total: number;
  page: number;
  limit: number;
  data: KitchenOrderItemDTO[];

  constructor(
    data: KitchenOrderItemDTO[],
    total: number,
    page: number,
    limit: number
  ) {
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.data = data;
  }
}
