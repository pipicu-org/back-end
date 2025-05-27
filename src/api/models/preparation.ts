import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Line } from './line';
import { State } from './state';

interface IPreparation {
  id: number;
  note: string;
  Line: Line;
  state: State;
}

@Entity('preparation')
export class Preparation implements IPreparation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  note!: string;

  @ManyToOne(() => Line, (line) => line.id, { nullable: false })
  Line!: Line;

  @ManyToOne(() => State, (state) => state.id, { nullable: false })
  state!: State;
}
