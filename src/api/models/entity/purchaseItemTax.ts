import { Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { PurchaseItem } from './purchaseItem';
import { Tax } from './tax';

interface IPurchaseItemTax {
  id: number;
  purchaseItemId: number;
  taxId: number;
  percentage: number;
  createdAt: Date;
  updatedAt: Date;
}

@Entity('PurchaseItemTax')
export class PurchaseItemTax implements IPurchaseItemTax {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int', nullable: false })
  purchaseItemId!: number;

  @Column({ type: 'int', nullable: false })
  taxId!: number;

  @Column({ type: 'numeric', precision: 5, scale: 2, nullable: false })
  percentage!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;

  // Relación muchos-a-uno con PurchaseItem
  @ManyToOne(() => PurchaseItem, (purchaseItem) => purchaseItem.purchaseItemTaxes, { nullable: false })
  @JoinColumn({ name: 'purchaseItemId' })
  purchaseItem!: PurchaseItem;

  // Relación muchos-a-uno con Tax
  @ManyToOne(() => Tax, (tax) => tax.purchaseItemTaxes, { nullable: false })
  @JoinColumn({ name: 'taxId' })
  tax!: Tax;
}