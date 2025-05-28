import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Ingredient } from './ingredient';
import { Product } from './product';

interface IRecipe {
  id: number;
  product: Product;
  ingredient: Ingredient;
  quantity: number;
  totalPrice: number;
}

@Entity('Recipe')
export class Recipe implements IRecipe {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToMany(() => Product, (product) => product.id)
  product!: Product;

  @OneToMany(() => Ingredient, (ingredient) => ingredient.id)
  ingredient!: Ingredient;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  quantity!: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  totalPrice!: number;
}
