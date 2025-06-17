import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product';

interface IFamily {
  id: number;
  name: string;
}

@Entity('Family')
export class Family implements IFamily {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  name!: string;

  @OneToMany(() => Product, (product) => product.family, {
    cascade: true,
    eager: true,
  })
  products!: Product[];
}
