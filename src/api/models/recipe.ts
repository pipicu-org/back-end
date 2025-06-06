import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Ingredient } from './ingredient';
import { Product } from './product';

interface IRecipe {
  id: number;
  ingredient: Ingredient;
  quantity: number;
  totalPrice: number;
}

@Entity('Recipe')
export class Recipe implements IRecipe {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Ingredient, (ingredient) => ingredient.recipes)
  @JoinColumn([{ name: 'ingredientId', referencedColumnName: 'id' }])
  ingredient!: Ingredient;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  quantity!: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  totalPrice!: number;

  @ManyToOne(() => Product, (product) => product.recipes, {
    cascade: true,
    eager: true,
  })
  @JoinColumn([{ name: 'productId', referencedColumnName: 'id' }])
  product!: Product;
}
