interface IOrderRequestDTO {
  clientId: number | null;
  lines: Array<{
    productId: number;
    quantity: number;
    paymentMethod: string;
    deliveryTime: Date;
    note: {
      note: string | null;
    };
  }>;
}
export class OrderRequestDTO implements IOrderRequestDTO {
  clientId: number;
  lines: Array<{
    productId: number;
    quantity: number;
    paymentMethod: string;
    deliveryTime: Date;
    note: {
      note: string | null;
    };
  }>;

  constructor(
    clientId: number,
    lines: Array<{
      productId: number;
      quantity: number;
      paymentMethod: string;
      deliveryTime: Date;
      note: {
        note: string | null;
      };
    }>,
  ) {
    this.clientId = clientId;
    this.lines = lines.map((line) => ({
      productId: line.productId,
      quantity: line.quantity,
      paymentMethod: line.paymentMethod,
      deliveryTime: line.deliveryTime,
      note: line.note,
    }));
  }
}
