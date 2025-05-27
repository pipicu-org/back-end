import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order';
import { Product } from './product';

interface ILine {
  id: number;
  order: Order;
  product: Product;
  quantity: number;
  totalPrice: number;
  addedAt: Date;
}

@Entity('line')
export class Line implements ILine {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToMany(() => Order, (order) => order.id)
  order!: Order;

  @OneToMany(() => Product, (product) => product.id)
  product!: Product;

  @Column({ type: 'int', precision: 10, scale: 2 })
  quantity!: number;

  @Column({ type: 'float', precision: 10, scale: 2 })
  totalPrice!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  addedAt!: Date;
}
