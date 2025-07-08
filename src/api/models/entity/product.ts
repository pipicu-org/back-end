import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
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
  stock: number;
  recipe: Recipe;
  lines: Line[];
}

@Entity('Product')
export class Product implements IProduct {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price!: number;

  @Column({ type: 'number' })
  stock!: number;

  @ManyToOne(() => Category, (category) => category.products, {
    eager: true,
  })
  @JoinColumn([{ name: 'categoryId', referencedColumnName: 'id' }])
  category!: Category;

  @OneToOne(() => Recipe, (recipe) => recipe.product, {
    eager: true,
    cascade: ['insert', 'update', 'remove'],
  })
  @JoinColumn([{ name: 'recipeId', referencedColumnName: 'id' }])
  recipe!: Recipe;

  @OneToMany(() => Line, (line) => line.product, {})
  lines!: Line[];
}
