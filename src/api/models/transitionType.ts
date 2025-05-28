import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

interface ITransitionType {
  id: number;
  name: string;
}
@Entity('Transition_type')
export class TransitionType implements ITransitionType {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;
}
