import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

interface IIngredient {
  id: number;
  name: string;
  price: number;
}

@Entity('ingredient')
export class Ingredient implements IIngredient {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;
  
  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price!: number;
}
