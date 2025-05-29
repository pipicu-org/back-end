import { IsNotEmpty } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

interface IClient {
  id: number;
  phoneNumber: string;
  name: string;
  address: string;
}
@Entity('Client')
export class Client implements IClient {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  @IsNotEmpty({
    message: 'Phone number is required',
  })
  phoneNumber!: string;
  @Column({ type: 'varchar', length: 255, nullable: false })
  @IsNotEmpty({
    message: 'Name is required',
  })
  name!: string;
  @Column({ type: 'varchar', length: 255, nullable: false })
  @IsNotEmpty({
    message: 'Address is required',
  })
  address!: string;
}
