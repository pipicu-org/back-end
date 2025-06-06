import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category';
import { Recipe } from './recipe';
import { Line } from './line';

interface IProduct {
  id: number;
  category: Category;
  name: string;
  price: number;
  recipes: Recipe[];
  lines: Line[];
}

@Entity('Product')
export class Product implements IProduct {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn([{ name: 'categoryId', referencedColumnName: 'id' }])
  category!: Category;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price!: number;

  @OneToMany(() => Recipe, (recipe) => recipe.product)
  recipes!: Recipe[];

  @OneToMany(() => Line, (line) => line.product, {
    cascade: true,
    eager: true,
  })
  lines!: Line[];
}
