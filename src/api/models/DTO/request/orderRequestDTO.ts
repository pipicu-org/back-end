import { Client } from '../../client';
import { Line } from '../../line';
import { State } from '../../state';

interface IOrderRequestDTO {
  state: State;
  client: Client;
  lines: Line[];
}
export class OrderRequestDTO implements IOrderRequestDTO {
  state: State;
  client: Client;
  lines: Line[];

  constructor(state: State, client: Client, lines: Line[]) {
    this.state = state;
    this.client = client;
    this.lines = lines;
  }
}
