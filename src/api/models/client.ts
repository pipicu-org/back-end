import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

interface IClient {
  id: number;
  phoneNumber: string;
  name: string;
  address: string;
}
@Entity('client')
export class Client implements IClient {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column({ type: 'varchar', length: 255 })
  phoneNumber!: string;
  @Column({ type: 'varchar', length: 255 })
  name!: string;
  @Column({ type: 'varchar', length: 255 })
  address!: string;
}
