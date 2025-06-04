export interface IClientRequestDTO {
  name: string;
  phoneNumber: string;
  address: string;
}

export class ClientRequestDTO implements IClientRequestDTO {
  name: string;
  phoneNumber: string;
  address: string;

  constructor(name: string, phoneNumber: string, address: string) {
    this.name = name;
    this.phoneNumber = phoneNumber;
    this.address = address;
  }
}
