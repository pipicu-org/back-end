import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Line } from './line';
import { Ingredient } from './ingredient';

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

  @ManyToOne(() => Ingredient, (ingredient) => ingredient.note, {
    eager: true,
  })
  @JoinColumn([{ name: 'ingredientId', referencedColumnName: 'id' }])
  ingredient!: Ingredient;
}
