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
import { Family } from './family';

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

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn([{ name: 'categoryId', referencedColumnName: 'id' }])
  category!: Category;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price!: number;

  @Column({ type: 'number', nullable: true })
  stock!: number;

  @ManyToOne(() => Recipe, (recipe) => recipe.product)
  @JoinColumn([{ name: 'recipeId', referencedColumnName: 'id' }])
  recipe!: Recipe;

  @OneToMany(() => Line, (line) => line.product, {
    cascade: true,
    eager: true,
  })
  lines!: Line[];

  @ManyToOne(() => Family, (family) => family.products, {
    cascade: true,
    eager: true,
  })
  @JoinColumn([{ name: 'familyId', referencedColumnName: 'id' }])
  family!: Family;
}
