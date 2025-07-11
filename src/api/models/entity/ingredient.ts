import { IsNotEmpty } from 'class-validator';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Recipe } from './recipe';

interface IIngredient {
  id: number;
  name: string;
  price: number;
  quantity: number;
  recipes: Recipe[];
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
    message: 'Quantity of ingredient is required',
  })
  quantity!: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: false })
  @IsNotEmpty({
    message: 'Price of ingredient is required',
  })
  price!: number;

  @ManyToMany(() => Recipe, (recipe) => recipe.ingredients, {
    eager: true,
  })
  recipes!: Recipe[];
}
