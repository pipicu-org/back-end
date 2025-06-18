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

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price!: number;

  @Column({ type: 'number', nullable: true })
  stock!: number;

  @ManyToOne(() => Category, (category) => category.products, {
    eager: true,
  })
  @JoinColumn([{ name: 'categoryId', referencedColumnName: 'id' }])
  category!: Category;

  @ManyToOne(() => Recipe, (recipe) => recipe.product) // se debe de crear la receta antes de crear el producto
  @JoinColumn([{ name: 'recipeId', referencedColumnName: 'id' }])
  recipe!: Recipe;

  @ManyToOne(() => Family, (family) => family.products, {
    eager: true,
  })
  @JoinColumn([{ name: 'familyId', referencedColumnName: 'id' }])
  family!: Family;

  @OneToMany(() => Line, (line) => line.product, {})
  lines!: Line[];
}
