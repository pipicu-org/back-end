import { TransitionType } from '../../../api/models/entity';
import { ISeed } from '../ISeed';

export class TransitionTypeSeed implements ISeed<TransitionType> {
  static instance: TransitionTypeSeed;

  static getInstance(): TransitionTypeSeed {
    if (!TransitionTypeSeed.instance) {
      TransitionTypeSeed.instance = new TransitionTypeSeed();
    }
    return TransitionTypeSeed.instance;
  }

  entity: string = 'TransitionType';
  data: TransitionType[] = [
    {
      id: 1,
      name: 'Order State Transition',
      transitions: [],
    },
    {
      id: 2,
      name: 'Line State Transition',
      transitions: [],
    },
  ];

  getEntity(): string {
    return this.entity;
  }

  getData(): TransitionType[] {
    return this.data;
  }
}
