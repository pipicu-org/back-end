import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

interface ICategory {
  id: number;
  name: string;
}

@Entity('Category')
export class Category implements ICategory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;
}
