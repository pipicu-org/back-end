import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

interface IState {
  id: number;
  name: string;
}

@Entity('State')
export class State implements IState {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;
}
