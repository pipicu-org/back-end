import { IsNotEmpty } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order';

interface IClient {
  id: number;
  phoneNumber: string;
  name: string;
  facebookUsername: string | null;
  instagramUsername: string | null;
  address: string;
}
@Entity('Client')
export class Client implements IClient {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @IsNotEmpty({
    message: 'Name is required',
  })
  name!: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  @IsNotEmpty({
    message: 'Phone number is required',
  })
  phoneNumber!: string;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  facebookUsername!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  instagramUsername!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @IsNotEmpty({
    message: 'Address is required',
  })
  address!: string;

  @OneToMany(() => Order, (order) => order.client, {
    eager: true,
  })
  orders!: Order[];
}
