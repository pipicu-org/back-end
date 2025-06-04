import { Client } from '../../client';

export interface IClientRequestDTO {
  id: number;
  name: string;
  phone: string;
  address: string;
}
export class ClientResponseDTO implements IClientRequestDTO {
  id: number;
  name: string;
  phone: string;
  address: string;

  constructor(client: Client) {
    this.id = client.id;
    this.name = client.name;
    this.phone = client.phoneNumber;
    this.address = client.address;
  }
}
