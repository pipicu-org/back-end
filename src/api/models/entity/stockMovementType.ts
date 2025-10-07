import { IsNotEmpty } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { StockMovement } from './stockMovement';

interface IStockMovementType {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

@Entity('StockMovementType')
export class StockMovementType implements IStockMovementType {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  @IsNotEmpty({ message: 'Stock movement type name is required' })
  name!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;

  // Relación uno-a-muchos con StockMovement
  @OneToMany(() => StockMovement, (stockMovement) => stockMovement.stockMovementType, {})
  stockMovements!: StockMovement[];
}