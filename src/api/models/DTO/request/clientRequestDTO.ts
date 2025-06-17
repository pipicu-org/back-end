export interface IClientRequestDTO {
  name: string;
  phoneNumber: string;
  address: string;
  facebookUsername?: string;
  instagramUsername?: string;
}

export class ClientRequestDTO implements IClientRequestDTO {
  name: string;
  phoneNumber: string;
  address: string;
  facebookUsername?: string;
  instagramUsername?: string;

  constructor(
    name: string,
    phoneNumber: string,
    address: string,
    facebookUsername?: string,
    instagramUsername?: string,
  ) {
    this.name = name;
    this.phoneNumber = phoneNumber;
    this.address = address;
    this.facebookUsername = facebookUsername;
    this.instagramUsername = instagramUsername;
  }
}
