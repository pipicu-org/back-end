import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsNotEmpty, IsArray } from 'class-validator';
import { Client } from './client';
import { State } from './state';
import { Line } from './line';

interface IOrder {
  id: number;
  clientId: number;
  deliveryTime: Date;
  contactMethod: string;
  paymentMethod: string;
  stateId: number;
  subTotal: number;
  total: number;
  taxTotal: number;
  createdAt: Date;
}

@Entity('Order')
export class Order implements IOrder {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int', nullable: false })
  clientId!: number;

  @Column({ type: 'timestamp', nullable: false })
  deliveryTime!: Date;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @IsNotEmpty({ message: 'Contact method is required' })
  contactMethod!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @IsNotEmpty({ message: 'Payment method is required' })
  paymentMethod!: string;

  @Column({ type: 'int', nullable: false })
  stateId!: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: false })
  subTotal!: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: false })
  total!: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: false })
  taxTotal!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  // Relación muchos-a-uno con Client
  @ManyToOne(() => Client, (client) => client.orders, {
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'clientId' })
  client!: Client;

  // Relación muchos-a-uno con State
  @ManyToOne(() => State, (state) => state.orders, { nullable: false })
  @JoinColumn({ name: 'stateId' })
  state!: State;

  // Relación uno-a-muchos con Line
  @OneToMany(() => Line, (line) => line.order, {
    onDelete: 'CASCADE',
    cascade: ['insert', 'update', 'remove'],
    eager: true,
  })
  @IsArray({ message: 'Lines must be an array of Line objects' })
  lines!: Line[];
}
