import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category';
import { Recipe } from './recipe';
import { Line } from './line';
import { ProductPersonalization } from './productPersonalization';

@Entity('Product')
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price!: number;

  @ManyToOne(() => Category, (category) => category.products, {
    eager: true,
  })
  @JoinColumn([{ name: 'categoryId', referencedColumnName: 'id' }])
  category!: Category;

  @OneToOne(() => Recipe, (recipe) => recipe.product, {
    eager: true,
    cascade: ['insert', 'update', 'remove'],
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'recipeId', referencedColumnName: 'id' }])
  recipe!: Recipe;

  @OneToMany(
    () => ProductPersonalization,
    (personalization) => personalization.product,
    {
      nullable: true,
      cascade: ['insert', 'update', 'remove'],
    },
  )
  personalizations!: ProductPersonalization[] | null;

  @OneToMany(() => Line, (line) => line.product, {})
  lines!: Line[];
}
