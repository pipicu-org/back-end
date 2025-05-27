import { Client } from '../../client';
import { Line } from '../../line';
import { State } from '../../state';

interface IOrderRequestDTO {
  state: State;
  client: Client;
  line: Line[];
}

export class OrderRequestDTO implements IOrderRequestDTO {
  state: State;
  client: Client;
  line: Line[];

  constructor(state: State, client: Client, line: Line[]) {
    this.state = state;
    this.client = client;
    this.line = line;
  }
}
