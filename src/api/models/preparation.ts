import {
  AfterInsert,
  AfterUpdate,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Line } from './line';
import { State } from './state';
import { emitWebSocketEvent } from '../../middlewares/webSocket';

interface IPreparation {
  id: number;
  note: string;
  Line: Line;
  state: State;
}

@Entity('Preparation')
export class Preparation implements IPreparation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  note!: string;

  @ManyToOne(() => Line, (line) => line.id, { nullable: false })
  Line!: Line;

  @ManyToOne(() => State, (state) => state.id, { nullable: false })
  state!: State;

  @AfterUpdate()
  @AfterInsert()
  emitUpdate() {
    if (this.state.name == 'Cocinandose' || this.state.name == 'Listo') {
      emitWebSocketEvent('preparationUpdate', {
        productId: this.Line.product.id,
      });
    }
  }
}
