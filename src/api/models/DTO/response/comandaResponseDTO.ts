interface Recipe {
  ingredient: {
    id: number;
    name: string;
  };
  unit: {
    id: number;
    name: string;
  };
  quantity: number;
}

interface Line {
  lineId: number;
  quantity: number;
  product: {
    id: number;
    name: string;
  };
  recipe: Recipe[];
}

interface Comanda {
  orderId: number;
  client: {
    id: number;
    name: string;
  };
  lines: Line[];
}

export class ComandaResponseDTO {
  page: number;
  limit: number;
  total: number;
  data: Comanda[];

  constructor(
    page: number,
    limit: number,
    total: number,
    data: Comanda[],
  ) {
    this.page = page;
    this.limit = limit;
    this.total = total;
    this.data = data;
  }
}
