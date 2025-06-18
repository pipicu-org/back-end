import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Product } from './product';

interface ICategory {
  id: number;
  name: string;
}

@Entity('Category')
export class Category implements ICategory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  @Unique(['name'])
  name!: string;

  @OneToMany(() => Product, (product) => product.category, {
    eager: true,
  })
  products!: Product[];
}
