import { Order } from '../../order';
import { Product } from '../../product';

interface ILineRequestDTO {
  order: Order;
  product: Product;
  quantity: number;
  price: number;
}

export class LineRequestDTO implements ILineRequestDTO {
  order: Order;
  product: Product;
  quantity: number;
  price: number;

  constructor(order: Order, product: Product, quantity: number, price: number) {
    this.order = order;
    this.product = product;
    this.quantity = quantity;
    this.price = price;
  }
}
