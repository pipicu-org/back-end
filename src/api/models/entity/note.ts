import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export interface INote {
  id: number;
  description: string;
}

@Entity('Note')
export class Note implements INote {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description!: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  quantity!: number;
}
