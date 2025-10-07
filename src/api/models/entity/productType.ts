import { IsNotEmpty } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

interface IProductType {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

@Entity('ProductType')
export class ProductType implements IProductType {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  @IsNotEmpty({ message: 'Product type name is required' })
  name!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;

  // Nota: En el diagrama, ProductType no tiene relaciones directas mostradas, pero podría tener con Product si se infiere.
}