import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Client } from './client';
import { State } from './state';
import { Line } from './line';

interface IOrder {
  id: number;
  state: State;
  client: Client;
  createdAt: Date;
  lines: Line[];
}

@Entity('order')
export class Order implements IOrder {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => State, (state) => state.id)
  state!: State;

  @ManyToOne(() => Client, (client) => client.id)
  client!: Client;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @OneToMany(() => Line, (line) => line.id)
  lines!: Line[];

  constructor(state: State, client: Client, lines: Line[]) {
    this.state = state;
    this.client = client;
    this.lines = lines;
  }
}
