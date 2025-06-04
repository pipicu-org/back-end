import { Client } from '../client';
import { ClientRequestDTO } from '../DTO/request/clientRequestDTO';

export class ClientFactory {
  public createClientFromRequestDTO(requestDTO: ClientRequestDTO): Client {
    try {
      const client = new Client();
      client.name = requestDTO.name;
      client.phoneNumber = requestDTO.phoneNumber;
      client.address = requestDTO.address;

      return client;
    } catch (error) {
      console.error('Error creating client from request DTO:', error);
      throw new Error('Failed to create client');
    }
  }
}
