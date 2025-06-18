import { Client } from '../../client';

export interface IClientRequestDTO {
  id: number;
  name: string;
  phone: string;
  address: string;
  facebookusername: string | null;
  instagramusername: string | null;
}
export class ClientResponseDTO implements IClientRequestDTO {
  id: number;
  name: string;
  phone: string;
  address: string;
  facebookusername: string | null;
  instagramusername: string | null;

  constructor(client: Client) {
    this.id = client.id;
    this.name = client.name;
    this.phone = client.phoneNumber;
    this.address = client.address;
    this.facebookusername = client.facebookUsername;
    this.instagramusername = client.instagramUsername;
  }
}
