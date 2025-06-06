import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order';
import { Product } from './product';
import { Preparation } from './preparation';

interface ILine {
  id: number;
  order: Order;
  product: Product;
  quantity: number;
  totalPrice: number;
  addedAt: Date;
}

@Entity('Line')
export class Line implements ILine {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Order, (order) => order.lines)
  @JoinColumn([{ name: 'orderId', referencedColumnName: 'id' }])
  order!: Order;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  quantity!: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  totalPrice!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  addedAt!: Date;

  @OneToMany(() => Preparation, (preparation) => preparation.Line, {
    cascade: true,
    eager: true,
  })
  preparations!: Preparation[];

  @ManyToOne(() => Product, (product) => product.lines)
  @JoinColumn([{ name: 'productId', referencedColumnName: 'id' }])
  product!: Product;
}
