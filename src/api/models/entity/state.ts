import { IsNotEmpty } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Preparation } from './preparation';
import { Order } from './order';
import { Transition } from './transition';

interface IState {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

@Entity('State')
export class State implements IState {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  @IsNotEmpty({ message: 'State name is required' })
  name!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;

  // Relación uno-a-muchos con Preparation
  @OneToMany(() => Preparation, (preparation) => preparation.state, {})
  preparations!: Preparation[];

  // Relación uno-a-muchos con Order
  @OneToMany(() => Order, (order) => order.state, {})
  orders!: Order[];

  // Relación uno-a-muchos con Transition (toState)
  @OneToMany(() => Transition, (transition) => transition.toState, {})
  toTransitions!: Transition[];

  // Relación uno-a-muchos con Transition (fromState)
  @OneToMany(() => Transition, (transition) => transition.fromState, {})
  fromTransitions!: Transition[];
}
