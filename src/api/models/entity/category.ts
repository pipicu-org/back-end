import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { Product } from './product';

interface ICategory {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

@Entity('Category')
export class Category implements ICategory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  @IsNotEmpty({ message: 'Category name is required' })
  name!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;

  // Relación uno-a-muchos con Product
  @OneToMany(() => Product, (product) => product.category, {})
  products!: Product[];
}
