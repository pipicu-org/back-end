import { Client } from '../../entity/client';

export class ClientResponseDTO {
  id: number;
  name: string;
  phoneNumber: string;
  address: string;
  facebookusername: string | null;
  instagramusername: string | null;

  constructor(client: Client) {
    this.id = client.id;
    this.name = client.name;
    this.phoneNumber = client.phoneNumber;
    this.address = client.address;
    this.facebookusername = client.facebookUsername;
    this.instagramusername = client.instagramUsername;
  }
}
