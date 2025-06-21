export interface IOrderRequestDTO {
  state: string;
  client: string;
  phone: string;
  address: string;
  deliveryTime: string;
  paymentMethod: string;
  lines: Array<{
    product: string;
    quantity: number;
    note: Array<{
      description: string;
      ingredient: string;
      quantity: number;
    }> | null;
  }>;
}

export class OrderRequestDTO implements IOrderRequestDTO {
  state: string;
  client: string;
  phone: string;
  address: string;
  deliveryTime: string;
  paymentMethod: string;
  lines: Array<{
    product: string;
    quantity: number;
    note: Array<{
      description: string;
      ingredient: string;
      quantity: number;
    }> | null;
  }>;

  constructor(orderRequestDTO: IOrderRequestDTO) {
    this.state = orderRequestDTO.state;
    this.client = orderRequestDTO.client;
    this.phone = orderRequestDTO.phone;
    this.address = orderRequestDTO.address;
    this.deliveryTime = orderRequestDTO.deliveryTime;
    this.paymentMethod = orderRequestDTO.paymentMethod;
    this.lines = orderRequestDTO.lines.map((line) => ({
      product: line.product,
      quantity: line.quantity,
      note:
        line.note?.map((note) => ({
          description: note.description,
          ingredient: note.ingredient,
          quantity: note.quantity,
        })) || null,
    }));
  }
}
