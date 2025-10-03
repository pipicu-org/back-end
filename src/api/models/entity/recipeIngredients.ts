import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Ingredient } from './ingredient';
import { Recipe } from './recipe';

export interface IRecipeIngredients {
  id: number;
  recipe: Recipe;
  ingredient: Ingredient;
  quantity: number;
}

@Entity('RecipeIngredients')
export class RecipeIngredients implements IRecipeIngredients {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  quantity!: number;

  @ManyToOne(() => Recipe, (recipe) => recipe.recipeIngredients, {
    eager: false,
    nullable: true,
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'recipeId', referencedColumnName: 'id' })
  recipe!: Recipe;

  @ManyToOne(() => Ingredient, (ingredient) => ingredient.recipeIngredients, {
    eager: false,
    nullable: false,
  })
  @JoinColumn({ name: 'ingredientId', referencedColumnName: 'id' })
  ingredient!: Ingredient;
}
