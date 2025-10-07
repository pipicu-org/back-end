import { IsNotEmpty, Min } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Ingredient } from './ingredient';
import { PurchaseItem } from './purchaseItem';
import { StockMovement } from './stockMovement';
import { RecipeIngredient } from './recipeIngredient';

interface IUnit {
  id: number;
  name: string;
  factor: number;
  createdAt: Date;
  updatedAt: Date;
}

@Entity('Unit')
export class Unit implements IUnit {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  @IsNotEmpty({ message: 'Unit name is required' })
  name!: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: false })
  @Min(0, { message: 'Factor must be positive' })
  factor!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;

  // Relación uno-a-muchos con Ingredient
  @OneToMany(() => Ingredient, (ingredient) => ingredient.unit, {})
  ingredients!: Ingredient[];

  // Relación uno-a-muchos con PurchaseItem
  @OneToMany(() => PurchaseItem, (purchaseItem) => purchaseItem.unit, {})
  purchaseItems!: PurchaseItem[];

  // Relación uno-a-muchos con StockMovement
  @OneToMany(() => StockMovement, (stockMovement) => stockMovement.unit, {})
  stockMovements!: StockMovement[];

  // Relación uno-a-muchos con RecipeIngredient
  @OneToMany(
    () => RecipeIngredient,
    (recipeIngredient) => recipeIngredient.unit,
    {},
  )
  recipeIngredient!: RecipeIngredient[];
}
