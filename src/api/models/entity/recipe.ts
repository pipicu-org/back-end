import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToMany,
  OneToOne,
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

  @OneToOne(() => Product, (product) => product.recipe, {})
  product!: Product;

  @BeforeInsert()
  @BeforeUpdate()
  calculateTotalPrice(): void {
    this.totalPrice = this.ingredients.reduce(
      (total, ingredient) => total + ingredient.price,
      0,
    );
  }
}
