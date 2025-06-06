import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Line } from './line';
import { State } from './state';

interface IPreparation {
  id: number;
  note: string;
  Line: Line;
  state: State;
}

@Entity('Preparation')
export class Preparation implements IPreparation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  note!: string;

  @ManyToOne(() => Line, (line) => line.preparations, { nullable: false })
  @JoinColumn([{ name: 'lineId', referencedColumnName: 'id' }])
  Line!: Line;

  @ManyToOne(() => State, (state) => state.preparations, { nullable: false })
  @JoinColumn([{ name: 'stateId', referencedColumnName: 'id' }])
  state!: State;
}
