import { State } from '../../state';

interface IStateResponseDTO {
  id: number;
  name: string;
}

export class StateResponseDTO implements IStateResponseDTO {
  id: number;
  name: string;

  constructor(state: State) {
    this.id = state.id;
    this.name = state.name;
  }
}
