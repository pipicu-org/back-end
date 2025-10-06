import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Ingredient } from './ingredient';
import { Recipe } from './recipe';
import { Unit } from './unit';

export interface IRecipeIngredient {
  id: number;
  recipeId: number;
  ingredientId: number;
  quantity: number;
  unitId: number;
}

@Entity('RecipeIngredient')
export class RecipeIngredient implements IRecipeIngredient {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int', nullable: false })
  recipeId!: number;

  @Column({ type: 'int', nullable: false })
  ingredientId!: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: false })
  quantity!: number;

  @Column({ type: 'int', nullable: false })
  unitId!: number;

  // Relación muchos-a-uno con Recipe
  @ManyToOne(() => Recipe, (recipe) => recipe.recipeIngredient, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'recipeId' })
  recipe!: Recipe;

  // Relación muchos-a-uno con Ingredient
  @ManyToOne(() => Ingredient, (ingredient) => ingredient.recipeIngredient, {
    nullable: false,
  })
  @JoinColumn({ name: 'ingredientId' })
  ingredient!: Ingredient;

  // Relación muchos-a-uno con Unit
  @ManyToOne(() => Unit, (unit) => unit.recipeIngredient, {
    nullable: false,
  })
  @JoinColumn({ name: 'unitId' })
  unit!: Unit;
}
