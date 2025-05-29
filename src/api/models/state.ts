import { IsNotEmpty } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

interface IState {
  id: number;
  name: string;
}

@Entity('State')
export class State implements IState {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  @IsNotEmpty({
    message: 'State name is required',
  })
  name!: string;

  constructor(name: string) {
    this.name = name;
  }
}
