import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Ingredient } from './ingredient';
import { Product } from './product';

interface IRecipe {
  id: number;
  ingredients: Ingredient[];
  totalPrice: number;
}

@Entity('Recipe')
export class Recipe implements IRecipe {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  totalPrice!: number;

  @ManyToMany(() => Ingredient, (ingredient) => ingredient.recipes, {
    eager: true,
  })
  ingredients!: Ingredient[];

  @OneToMany(() => Product, (product) => product.recipe, {
    eager: true,
  })
  @JoinColumn([{ name: 'productId', referencedColumnName: 'id' }])
  product!: Product;
}
