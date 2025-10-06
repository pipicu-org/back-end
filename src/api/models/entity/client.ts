import { Allow, IsNotEmpty } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order';

interface IClient {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
  facebookUsername: string | null;
  instagramUsername: string | null;
  createdAt: Date;
  updatedAt: Date;
}

@Entity('Client')
export class Client implements IClient {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @IsNotEmpty({ message: 'Name is required' })
  name!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @IsNotEmpty({ message: 'Address is required' })
  address!: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  @IsNotEmpty({ message: 'Phone number is required' })
  phoneNumber!: string;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  facebookUsername!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  instagramUsername!: string | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;

  // Relación uno-a-muchos con Order
  @OneToMany(() => Order, (order) => order.client, {})
  orders!: Order[];
}
