import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Line } from './line';

export interface INote {
  id: number;
  note: string;
  line: Line;
}

@Entity('Note')
export class Note implements INote {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  note!: string;

  @OneToOne(() => Line, (line) => line.note, { nullable: false })
  @JoinColumn([{ name: 'lineId', referencedColumnName: 'id' }])
  line!: Line;
}
