import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product';
import { RecipeIngredients } from './recipeIngredients';

interface IRecipe {
  id: number;
  totalPrice: number;
  recipeIngredients: RecipeIngredients[];
  product: Product;
}

@Entity('Recipe')
export class Recipe implements IRecipe {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  totalPrice!: number;

  @OneToMany(
    () => RecipeIngredients,
    (recipeIngredient) => recipeIngredient.recipe,
    {
      cascade: ['insert', 'update', 'remove'],
      eager: true,
      onDelete: 'CASCADE',
    },
  )
  recipeIngredients!: RecipeIngredients[];

  @OneToOne(() => Product, (product) => product.recipe, {
    nullable: true,
  })
  product!: Product;
}
