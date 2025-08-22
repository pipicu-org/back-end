import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order';
import { Product } from './product';
import { Preparation } from './preparation';
import { ProductPersonalization } from './productPersonalization';

@Entity('Line')
export class Line {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  quantity!: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  totalPrice!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  addedAt!: Date;

  @ManyToOne(() => Order, (order) => order.lines, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn([{ name: 'orderId', referencedColumnName: 'id' }])
  order!: Order;

  @ManyToOne(() => Product, (product) => product.lines, {
    eager: true,
  })
  @JoinColumn([{ name: 'productId', referencedColumnName: 'id' }])
  product!: Product;

  @OneToOne(() => Preparation, (preparation) => preparation.Line, {
    cascade: ['insert', 'update', 'remove'],
    eager: true,
  })
  @OneToMany(
    () => ProductPersonalization,
    (personalizations) => personalizations.line,
    {
      cascade: ['insert', 'update', 'remove'],
    },
  )
  personalizations!: ProductPersonalization[];

  @JoinColumn([{ name: 'preparationId', referencedColumnName: 'id' }])
  preparation!: Preparation;
}
