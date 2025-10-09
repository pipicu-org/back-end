export class StockMovementPaginationDTO {
  total: number;
  page: number;
  limit: number;
  data: Array<{
    id: number;
    ingredientId: number;
    quantity: number;
    unitId: number;
    stockMovementTypeId: number;
    purchaseItemId: number | null;
    createdAt: string;
    updatedAt: string;
  }>;

  constructor(
    total: number,
    page: number,
    limit: number,
    data: Array<{
      id: number;
      ingredientId: number;
      quantity: number;
      unitId: number;
      stockMovementTypeId: number;
      purchaseItemId: number | null;
      createdAt: string;
      updatedAt: string;
    }>,
  ) {
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.data = data;
  }
}
