export class StockMovementPaginationDTO {
  total: number;
  page: number;
  limit: number;
  data: Array<{
    id: number;
    ingredient: {
      id: number;
      name: string;
    };
    quantity: number;
    unit: {
      id: number;
      name: string;
    };
    stockMovementType: {
      id: number;
      name: string;
    };
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
      ingredient: {
        id: number;
        name: string;
      };
      quantity: number;
      unit: {
        id: number;
        name: string;
      };
      stockMovementType: {
        id: number;
        name: string;
      };
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
