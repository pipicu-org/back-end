interface IOrderRequestDTO {
  stateId: number;
  clientId: number;
  lines: Array<{
    productId: number;
    quantity: number;
  }>;
}
export class OrderRequestDTO implements IOrderRequestDTO {
  stateId: number;
  clientId: number;
  lines: Array<{
    productId: number;
    quantity: number;
  }>;

  constructor(
    stateId: number,
    clientId: number,
    lines: Array<{
      productId: number;
      quantity: number;
    }>,
  ) {
    this.stateId = stateId;
    this.clientId = clientId;
    this.lines = lines.map((line) => ({
      productId: line.productId,
      quantity: line.quantity,
    }));
  }
}
