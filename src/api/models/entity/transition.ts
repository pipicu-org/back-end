import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TransitionType } from './transitionType';
import { State } from './state';

interface ITransition {
  id: number;
  fromState: State;
  toState: State;
  transitionatorId: number;
  transitionType: TransitionType;
  createdAt: Date;
  duration: number;
}

@Entity('Transition')
export class Transition implements ITransition {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'bigint', nullable: true })
  duration!: number;

  @ManyToOne(() => State, (state) => state.fromTransitions, { nullable: false })
  @JoinColumn([{ name: 'fromStateId', referencedColumnName: 'id' }])
  fromState!: State;

  @ManyToOne(() => State, (state) => state.toTransitions, { nullable: false })
  @JoinColumn([{ name: 'toStateId', referencedColumnName: 'id' }])
  toState!: State;

  @Column({ type: 'bigint', nullable: false })
  transitionatorId!: number;

  @ManyToOne(
    () => TransitionType,
    (transitionType) => transitionType.transitions,
    {
      nullable: false,

      eager: true,
    },
  )
  @JoinColumn([{ name: 'transitionTypeId', referencedColumnName: 'id' }])
  transitionType!: TransitionType;
}
