import { IsNotEmpty, Min, Max } from 'class-validator';
import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Unit } from './unit';
import { RecipeIngredient } from './recipeIngredient';
import { StockMovement } from './stockMovement';
import { PurchaseItem } from './purchaseItem';

interface IIngredient {
  id: number;
  name: string;
  unitId: number;
  lossFactor: number;
  cost?: number;
  createdAt: Date;
  updatedAt: Date;
}

@Entity('Ingredient')
export class Ingredient implements IIngredient {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  @IsNotEmpty({ message: 'Name of ingredient is required' })
  name!: string;

  @Column({ type: 'int', nullable: false })
  unitId!: number;

  @Column({ type: 'numeric', precision: 5, scale: 2, nullable: false })
  @Min(0, { message: 'Loss factor must be at least 0' })
  @Max(1, { message: 'Loss factor must be at most 1' })
  lossFactor!: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true, default: 0 })
  cost?: number;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: {
      from: (value: string) => parseFloat(value),
      to: (value: number) => value,
    },
  })
  stock!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;

  // Relación muchos-a-uno con Unit
  @ManyToOne(() => Unit, (unit) => unit.ingredients, { nullable: false })
  @JoinColumn({ name: 'unitId' })
  unit!: Unit;

  // Relación uno-a-muchos con RecipeIngredient
  @OneToMany(
    () => RecipeIngredient,
    (recipeIngredient) => recipeIngredient.ingredient,
    {},
  )
  recipeIngredient!: RecipeIngredient[];

  // Relación uno-a-muchos con StockMovement
  @OneToMany(
    () => StockMovement,
    (stockMovement) => stockMovement.ingredient,
    {},
  )
  stockMovements!: StockMovement[];

  // Relación uno-a-muchos con PurchaseItem
  @OneToMany(() => PurchaseItem, (purchaseItem) => purchaseItem.ingredient, {})
  purchaseItems!: PurchaseItem[];
}
