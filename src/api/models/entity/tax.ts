import { IsNotEmpty, Min, Max } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PurchaseItemTax } from './purchaseItemTax';

interface ITax {
  id: number;
  name: string;
  percentage: number;
  createdAt: Date;
  updatedAt: Date;
}

@Entity('Tax')
export class Tax implements ITax {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  @IsNotEmpty({ message: 'Tax name is required' })
  name!: string;

  @Column({ type: 'numeric', precision: 5, scale: 2, nullable: false })
  @Min(0, { message: 'Percentage must be at least 0' })
  @Max(100, { message: 'Percentage must be at most 100' })
  percentage!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;

  // Relación uno-a-muchos con PurchaseItemTax
  @OneToMany(() => PurchaseItemTax, (purchaseItemTax) => purchaseItemTax.tax, {})
  purchaseItemTaxes!: PurchaseItemTax[];
}