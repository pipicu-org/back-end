import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Transition } from './transition';

interface ITransitionType {
  id: number;
  name: string;
  transitions: Transition[];
}
@Entity('Transition_type')
export class TransitionType implements ITransitionType {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @OneToMany(() => Transition, (transition) => transition.transitionType, {
    nullable: false,
  })
  transitions!: Transition[];
}
