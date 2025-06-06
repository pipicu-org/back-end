import {
  AfterInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TransitionType } from './transitionType';
import { State } from './state';
import { emitWebSocketEvent } from '../../middlewares/webSocket';

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

  @ManyToOne(() => State, (state) => state.fromTransitions, { nullable: false })
  @JoinColumn([{ name: 'fromStateId', referencedColumnName: 'id' }])
  fromState!: State;

  @ManyToOne(() => State, (state) => state.toTransitions, { nullable: false })
  @JoinColumn([{ name: 'toStateId', referencedColumnName: 'id' }])
  toState!: State;

  @Column()
  transitionatorId!: number;

  @ManyToOne(
    () => TransitionType,
    (transitionType) => transitionType.transitions,
    {
      nullable: false,
    },
  )
  @JoinColumn([{ name: 'transitionTypeId', referencedColumnName: 'id' }])
  transitionType!: TransitionType;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'bigint', nullable: true })
  duration!: number;

  @AfterInsert()
  emitUpdate() {
    emitWebSocketEvent('newTransition', {
      transitionId: this.id,
      fromStateId: this.fromState.id,
      toStateId: this.toState.id,
      transitionTypeId: this.transitionType.id,
      transitionatorId: this.transitionatorId,
      createdAt: this.createdAt,
      duration: this.duration,
    });
  }
}
