import { State } from '../../../api/models/entity';
import { ISeed } from '../ISeed';

export class StateSeed implements ISeed<State> {
  static instance: StateSeed;

  static getInstance(): StateSeed {
    if (!StateSeed.instance) {
      StateSeed.instance = new StateSeed();
    }
    return StateSeed.instance;
  }

  entity: string = 'State';
  data: State[] = [
    {
      id: 1,
      name: 'Creado',
      fromTransitions: [],
      toTransitions: [],
      orders: [],
      preparations: [],
    },
    {
      id: 2,
      name: 'Pendiente',
      fromTransitions: [],
      toTransitions: [],
      orders: [],
      preparations: [],
    },
    {
      id: 3,
      name: 'Preparado',
      fromTransitions: [],
      toTransitions: [],
      orders: [],
      preparations: [],
    },
    {
      id: 4,
      name: 'En camino',
      fromTransitions: [],
      toTransitions: [],
      orders: [],
      preparations: [],
    },
    {
      id: 5,
      name: 'Entregado',
      fromTransitions: [],
      toTransitions: [],
      orders: [],
      preparations: [],
    },
    {
      id: 6,
      name: 'Cancelado',
      fromTransitions: [],
      toTransitions: [],
      orders: [],
      preparations: [],
    },
  ];

  getEntity(): string {
    return this.entity;
  }

  getData(): State[] {
    return this.data;
  }
}
