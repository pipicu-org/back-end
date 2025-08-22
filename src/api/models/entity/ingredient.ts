import { IsNotEmpty } from 'class-validator';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RecipeIngredients } from './recipeIngredients';
import { Personalization } from './personalization';

interface IIngredient {
  id: number;
  name: string;
  price: number;
  recipeIngredients: RecipeIngredients[];
}

@Entity('Ingredient')
export class Ingredient implements IIngredient {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  @IsNotEmpty({
    message: 'Name of ingredient is required',
  })
  name!: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: false })
  @IsNotEmpty({
    message: 'Price of ingredient is required',
  })
  price!: number;

  @OneToMany(
    () => RecipeIngredients,
    (recipeIngredient) => recipeIngredient.ingredient,
    {
      nullable: false,
    },
  )
  recipeIngredients!: RecipeIngredients[];

  @OneToOne(
    () => Personalization,
    (personalization) => personalization.ingredient,
    {
      nullable: true,
    },
  )
  personalization!: Personalization;
}
