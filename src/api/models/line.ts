import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order';
import { Product } from './product';
import { Preparation } from './preparation';
import { Note } from './note';

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

  @ManyToOne(() => Product, (product) => product.lines)
  @JoinColumn([{ name: 'productId', referencedColumnName: 'id' }])
  product!: Product;

  @OneToOne(() => Preparation, (preparation) => preparation.Line, {
    cascade: true,
    eager: true,
  })
  @JoinColumn([{ name: 'preparationId', referencedColumnName: 'id' }])
  preparation!: Preparation;

  @OneToOne(() => Note, (note) => note.line, {
    cascade: true,
    eager: true,
    nullable: true,
  })
  @JoinColumn([{ name: 'noteId', referencedColumnName: 'id' }])
  note!: Note;
}
