import { IsNotEmpty } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

interface IIngredient {
  id: number;
  name: string;
  price: number;
}

@Entity('Ingredient')
export class Ingredient implements IIngredient {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  @IsNotEmpty({
    message: 'Name of ingredient is required',
  })
  name!: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: false })
  @IsNotEmpty({
    message: 'Price of ingredient is required',
  })
  price!: number;
}
