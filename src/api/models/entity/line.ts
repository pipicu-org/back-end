import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Min } from 'class-validator';
import { Order } from './order';
import { Product } from './product';

interface ILine {
  id: number;
  note: string;
  productId: number;
  orderId: number;
  unitPrice: number;
  quantity: number;
  subTotal: number;
  totalPrice: number;
  cost?: number;
  createdAt: Date;
  updatedAt: Date;
}

@Entity('Line')
export class Line implements ILine {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text', nullable: true })
  note!: string;

  @Column({ type: 'int', nullable: false })
  productId!: number;

  @Column({ type: 'int', nullable: false })
  orderId!: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: false })
  @Min(0, { message: 'Unit price must be positive' })
  unitPrice!: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: false })
  @Min(0, { message: 'Quantity must be positive' })
  quantity!: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true, default: 0 })
  @Min(0, { message: 'SubTotal must be positive' })
  subTotal!: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: false })
  @Min(0, { message: 'Total price must be positive' })
  totalPrice!: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true, default: 0 })
  cost?: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;

  // Relación muchos-a-uno con Product
  @ManyToOne(() => Product, (product) => product.lines, {
    nullable: false,
  })
  @JoinColumn({ name: 'productId' })
  product!: Product;

  // Relación muchos-a-uno con Order
  @ManyToOne(() => Order, (order) => order.lines, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'orderId' })
  order!: Order;
}
