import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Provider } from './provider';
import { PurchaseItem } from './purchaseItem';

interface IPurchase {
  id: number;
  providerId: number;
  createdAt: Date;
  updatedAt: Date;
}

@Entity('Purchase')
export class Purchase implements IPurchase {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int', nullable: false })
  providerId!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;

  // Relación muchos-a-uno con Provider
  @ManyToOne(() => Provider, (provider) => provider.purchases, {
    nullable: false,
  })
  @JoinColumn({ name: 'providerId' })
  provider!: Provider;

  // Relación uno-a-muchos con PurchaseItem
  @OneToMany(() => PurchaseItem, (purchaseItem) => purchaseItem.purchase, {
    cascade: true,
  })
  purchaseItems!: PurchaseItem[];
}
