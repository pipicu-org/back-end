interface ILineRequestDTO {
  orderId: number;
  productId: number;
  quantity: number;
}

export class LineRequestDTO implements ILineRequestDTO {
  orderId: number;
  productId: number;
  quantity: number;

  constructor(orderId: number, productId: number, quantity: number) {
    this.orderId = orderId;
    this.productId = productId;
    this.quantity = quantity;
  }
}
