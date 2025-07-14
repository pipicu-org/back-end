import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Client } from './client';
import { State } from './state';
import { Line } from './line';
import { IsArray, IsEmpty } from 'class-validator';

interface IOrder {
  id: number;
  state: State;
  client: Client;
  createdAt: Date;
  lines: Line[];
  deliveryTime: Date;
  paymentMethod: string;
  totalPrice: number;
}

@Entity('Order')
export class Order implements IOrder {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  totalPrice!: number;

  @ManyToOne(() => State, (state) => state.orders)
  @JoinColumn([{ name: 'stateId', referencedColumnName: 'id' }])
  state!: State;

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  deliveryTime!: Date;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @IsEmpty({
    message: 'Payment method cannot be empty',
  })
  paymentMethod!: string;

  @ManyToOne(() => Client, (client) => client.orders, {
    eager: true,
  })
  @JoinColumn([{ name: 'clientId', referencedColumnName: 'id' }])
  client!: Client;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @OneToMany(() => Line, (line) => line.order, {
    cascade: ['insert', 'update', 'remove'],
    eager: true,
  })
  @IsArray({
    message: 'Lines must be an array of Line objects',
  })
  lines!: Line[];

  @BeforeInsert()
  setHorarioEntrega() {
    if (!this.deliveryTime) {
      this.deliveryTime = new Date(Date.now() + 30 * 60 * 1000);
    }
  }
}
