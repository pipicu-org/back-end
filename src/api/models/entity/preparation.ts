import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Line } from './line';
import { State } from './state';

interface IPreparation {
  id: number;
  Line: Line;
  state: State;
}

@Entity('Preparation')
export class Preparation implements IPreparation {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => State, (state) => state.preparations, { nullable: false })
  @JoinColumn([{ name: 'stateId', referencedColumnName: 'id' }])
  state!: State;

  @OneToOne(() => Line, (line) => line.preparation, { nullable: false })
  Line!: Line;
}
