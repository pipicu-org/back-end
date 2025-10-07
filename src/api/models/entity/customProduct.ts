import { Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product';
import { Recipe } from './recipe';

interface ICustomProduct {
  id: number;
  baseProductId: number;
  recipeId: number;
  createdAt: Date;
  updatedAt: Date;
}

@Entity('CustomProduct')
export class CustomProduct implements ICustomProduct {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int', nullable: false })
  baseProductId!: number;

  @Column({ type: 'int', nullable: false })
  recipeId!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;

  // Relación muchos-a-uno con Product (baseProduct)
  @ManyToOne(() => Product, { nullable: false })
  @JoinColumn({ name: 'baseProductId' })
  baseProduct!: Product;

  // Relación muchos-a-uno con Recipe
  @ManyToOne(() => Recipe, { nullable: false })
  @JoinColumn({ name: 'recipeId' })
  recipe!: Recipe;
}