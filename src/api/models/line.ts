import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order';
import { Product } from './product';
import { emitWebSocketEvent } from '../../middlewares/webSocket';

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

  @OneToMany(() => Order, (order) => order.id)
  order!: Order;

  @OneToMany(() => Product, (product) => product.id)
  product!: Product;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  quantity!: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  totalPrice!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  addedAt!: Date;

  @AfterInsert()
  @AfterUpdate()
  @AfterRemove()
  emitEvent(): void {
    console.log('Line event emitted:', this);
    emitWebSocketEvent('tableChanged', {
      productId: this.product.id,
    });
  }
}
