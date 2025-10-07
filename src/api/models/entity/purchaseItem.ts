import { Column, Entity, ManyToOne, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Purchase } from './purchase';
import { Ingredient } from './ingredient';
import { Unit } from './unit';
import { PurchaseItemTax } from './purchaseItemTax';
import { StockMovement } from './stockMovement';

interface IPurchaseItem {
  id: number;
  purchaseId: number;
  ingredientId: number;
  cost: number;
  quantity: number;
  unitId: number;
  unitQuantity: number;
  createdAt: Date;
  updatedAt: Date;
}

@Entity('PurchaseItem')
export class PurchaseItem implements IPurchaseItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int', nullable: false })
  purchaseId!: number;

  @Column({ type: 'int', nullable: false })
  ingredientId!: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: false })
  cost!: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: false })
  quantity!: number;

  @Column({ type: 'int', nullable: false })
  unitId!: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: false })
  unitQuantity!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;

  // Relación muchos-a-uno con Purchase
  @ManyToOne(() => Purchase, (purchase) => purchase.purchaseItems, { nullable: false })
  @JoinColumn({ name: 'purchaseId' })
  purchase!: Purchase;

  // Relación muchos-a-uno con Ingredient
  @ManyToOne(() => Ingredient, (ingredient) => ingredient.purchaseItems, { nullable: false })
  @JoinColumn({ name: 'ingredientId' })
  ingredient!: Ingredient;

  // Relación muchos-a-uno con Unit
  @ManyToOne(() => Unit, (unit) => unit.purchaseItems, { nullable: false })
  @JoinColumn({ name: 'unitId' })
  unit!: Unit;

  // Relación uno-a-muchos con PurchaseItemTax
  @OneToMany(() => PurchaseItemTax, (purchaseItemTax) => purchaseItemTax.purchaseItem, {})
  purchaseItemTaxes!: PurchaseItemTax[];

  // Relación uno-a-muchos con StockMovement
  @OneToMany(() => StockMovement, (stockMovement) => stockMovement.purchaseItem, {})
  stockMovements!: StockMovement[];
}