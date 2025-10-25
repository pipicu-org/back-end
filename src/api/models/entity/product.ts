import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { Category } from './category';
import { Recipe } from './recipe';
import { Line } from './line';
import { ProductType } from './productType';

interface IProduct {
  id: number;
  name: string;
  preTaxPrice: number;
  price: number;
  recipeId: number | null;
  categoryId: number;
  productTypeId: number;
  parentProductId: number | null;
  createdAt: Date;
  updatedAt: Date;
}

@Entity('Product')
export class Product implements IProduct {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @IsNotEmpty({ message: 'Product name is required' })
  name!: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: false })
  preTaxPrice!: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: false })
  price!: number;

  @Column({ type: 'int', nullable: true })
  recipeId!: number | null;

  @Column({ type: 'int', nullable: false })
  categoryId!: number;

  @Column({ type: 'int', nullable: false, default: 1 })
  productTypeId!: number;

  @Column({ type: 'int', nullable: true, default: null })
  parentProductId!: number | null;

  maxPrepareable!: number;

  cost!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;

  // Relación muchos-a-uno con Category
  @ManyToOne(() => Category, (category) => category.products, {
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'categoryId' })
  category!: Category;

  // Relación uno-a-uno con Recipe
  @OneToOne(() => Recipe, (recipe) => recipe.product, {
    cascade: ['insert', 'update', 'remove'],
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'recipeId' })
  recipe!: Recipe;

  // Relación uno-a-muchos con Line
  @OneToMany(() => Line, (line) => line.product, {})
  lines!: Line[];

  @ManyToOne(() => ProductType, (productType) => productType.products, {
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'productTypeId' })
  productType!: ProductType;

  @ManyToOne(() => Product, (product) => product.productChildrens, {
    nullable: true,
  })
  @JoinColumn({ name: 'parentProductId' })
  parentProduct!: Product;

  @OneToMany(() => Product, (product) => product.parentProduct)
  productChildrens!: Product[];
}
