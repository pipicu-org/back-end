import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from './category';
import { Recipe } from './recipe';

interface IProduct {
  id: number;
  Category: Category;
  name: string;
  price: number;
  ingredients: Recipe[];
}

@Entity('product')
export class Product implements IProduct {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToMany(() => Category, (category) => category.id)
  Category!: Category;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'float', precision: 10, scale: 2 })
  price!: number;

  @OneToMany(() => Recipe, (recipe) => recipe.product)
  ingredients!: Recipe[];
}
