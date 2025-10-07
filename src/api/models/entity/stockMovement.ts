import { Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Ingredient } from './ingredient';
import { Unit } from './unit';
import { StockMovementType } from './stockMovementType';
import { PurchaseItem } from './purchaseItem';

interface IStockMovement {
  id: number;
  ingredientId: number;
  quantity: number;
  unitId: number;
  stockMovementTypeId: number;
  purchaseItemId: number | null;
  createdAt: Date;
  updatedAt: Date;
}

@Entity('StockMovement')
export class StockMovement implements IStockMovement {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int', nullable: false })
  ingredientId!: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: false })
  quantity!: number;

  @Column({ type: 'int', nullable: false })
  unitId!: number;

  @Column({ type: 'int', nullable: false })
  stockMovementTypeId!: number;

  @Column({ type: 'int', nullable: true })
  purchaseItemId!: number | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;

  // Relación muchos-a-uno con Ingredient
  @ManyToOne(() => Ingredient, (ingredient) => ingredient.stockMovements, { nullable: false })
  @JoinColumn({ name: 'ingredientId' })
  ingredient!: Ingredient;

  // Relación muchos-a-uno con Unit
  @ManyToOne(() => Unit, (unit) => unit.stockMovements, { nullable: false })
  @JoinColumn({ name: 'unitId' })
  unit!: Unit;

  // Relación muchos-a-uno con StockMovementType
  @ManyToOne(() => StockMovementType, (stockMovementType) => stockMovementType.stockMovements, { nullable: false })
  @JoinColumn({ name: 'stockMovementTypeId' })
  stockMovementType!: StockMovementType;

  // Relación muchos-a-uno con PurchaseItem (opcional)
  @ManyToOne(() => PurchaseItem, (purchaseItem) => purchaseItem.stockMovements, { nullable: true })
  @JoinColumn({ name: 'purchaseItemId' })
  purchaseItem!: PurchaseItem | null;
}