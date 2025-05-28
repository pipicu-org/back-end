import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Preparation } from './preparation';
import { TransitionType } from './transitionType';
import { State } from './state';

interface ITransition {
  id: number;
  fromState: State;
  toState: State;
  transitionator: Preparation;
  transitionType: TransitionType;
  createdAt: Date;
  duration: number;
}

@Entity('transition')
export class Transition implements ITransition {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => State, (state) => state.id, { nullable: false })
  fromState!: State;

  @ManyToOne(() => State, (state) => state.id, { nullable: false })
  toState!: State;

  @ManyToOne(() => Preparation, (preparation) => preparation.id, {
    nullable: false,
  })
  transitionator!: Preparation;

  @ManyToOne(() => TransitionType, (transitionType) => transitionType.id, {
    nullable: false,
  })
  transitionType!: TransitionType;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'bigint', nullable: true })
  duration!: number;
}
