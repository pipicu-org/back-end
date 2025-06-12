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

  @ManyToMany(() => Ingredient, (ingredient) => ingredient.recipes)
  @JoinColumn([{ name: 'ingredientId', referencedColumnName: 'id' }])
  ingredients!: Ingredient[];

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  totalPrice!: number;

  @OneToMany(() => Product, (product) => product.recipe, {
    cascade: true,
    eager: true,
  })
  @JoinColumn([{ name: 'productId', referencedColumnName: 'id' }])
  product!: Product;
}
