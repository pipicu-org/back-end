interface IStateRequestDTO {
  name: string;
}

export class StateRequestDTO implements IStateRequestDTO {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}
