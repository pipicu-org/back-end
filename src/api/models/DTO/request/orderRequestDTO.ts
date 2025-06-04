interface IOrderRequestDTO {
  stateId: number;
  clientId: number;
  linesId: number[];
}
export class OrderRequestDTO implements IOrderRequestDTO {
  stateId: number;
  clientId: number;
  linesId: number[];

  constructor(stateId: number, clientId: number, linesId: number[]) {
    this.stateId = stateId;
    this.clientId = clientId;
    this.linesId = linesId;
  }
}
