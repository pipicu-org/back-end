import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product';
import { RecipeIngredient } from './recipeIngredient';
import { CustomProduct } from './customProduct';

interface IRecipe {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

@Entity('Recipe')
export class Recipe implements IRecipe {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;

  // Relación uno-a-muchos con RecipeIngredient
  @OneToMany(() => RecipeIngredient, (recipeIngredient) => recipeIngredient.recipe, {
    cascade: ['insert', 'update', 'remove'],
    onDelete: 'CASCADE',
  })
  recipeIngredient!: RecipeIngredient[];

  // Relación uno-a-uno con Product
  @OneToOne(() => Product, (product) => product.recipe, {
    nullable: true,
  })
  product!: Product | null;

  // Relación uno-a-muchos con CustomProduct
  @OneToMany(() => CustomProduct, (customProduct) => customProduct.recipe, {})
  customProducts!: CustomProduct[];
}
