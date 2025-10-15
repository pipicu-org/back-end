import { ClientRequestDTO } from '../../src/api/models/DTO/request/clientRequestDTO';
import { ClientResponseDTO } from '../../src/api/models/DTO/response/clientResponseDTO';
import { Client } from '../../src/api/models/entity/client';

export const mockClientRequestDTO: ClientRequestDTO = {
  name: 'John Doe',
  phoneNumber: '123456789',
  address: '123 Main St',
  facebookUsername: 'johndoe_fb',
  instagramUsername: 'johndoe_ig',
};

export const mockClientEntity: Client = {
  id: 1,
  name: 'John Doe',
  phoneNumber: '123456789',
  address: '123 Main St',
  facebookUsername: 'johndoe_fb',
  instagramUsername: 'johndoe_ig',
  createdAt: new Date(),
  updatedAt: new Date(),
  orders: [],
};

export const mockClientResponseDTO: ClientResponseDTO = {
  id: 1,
  name: 'John Doe',
  phoneNumber: '123456789',
  address: '123 Main St',
  facebookusername: 'johndoe_fb',
  instagramusername: 'johndoe_ig',
};