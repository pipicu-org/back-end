import { IsNotEmpty } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Preparation } from './preparation';
import { Order } from './order';
import { Transition } from './transition';

interface IState {
  id: number;
  name: string;
}

@Entity('State')
export class State implements IState {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  @IsNotEmpty({
    message: 'State name is required',
  })
  name!: string;

  @OneToMany(() => Preparation, (preparation) => preparation.state, {})
  preparations!: Preparation[];

  @OneToMany(() => Order, (order) => order.state, {})
  orders!: Order[];

  @OneToMany(() => Transition, (transition) => transition.toState, {})
  toTransitions!: Transition[];

  @OneToMany(() => Transition, (transition) => transition.fromState, {})
  fromTransitions!: Transition[];
}
