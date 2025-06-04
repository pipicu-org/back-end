import { clientFactory } from '../../config';
import { ClientRequestDTO } from '../models/DTO/request/clientRequestDTO';
import { ClientResponseDTO } from '../models/DTO/response/clientResponseDTO';
import { ICLientRepository } from './client.repository';

export interface IClientService {
  createClient(client: ClientRequestDTO): Promise<ClientResponseDTO>;
  getClientById(id: number): Promise<ClientResponseDTO | null>;
  updateClient(
    id: number,
    client: ClientRequestDTO,
  ): Promise<ClientResponseDTO | null>;
  deleteClient(id: number): Promise<ClientResponseDTO | null>;
  getAllClients(): Promise<ClientResponseDTO[]>;
}

export class ClientService implements IClientService {
  constructor(private readonly clientRepository: ICLientRepository) {}

  async createClient(client: ClientRequestDTO): Promise<ClientResponseDTO> {
    try {
      const newClient = clientFactory.createClientFromRequestDTO(client);
      const createdClient = await this.clientRepository.create(newClient);
      return new ClientResponseDTO(createdClient);
    } catch (error) {
      console.error('Error creating client:', error);
      throw new Error('Failed to create client');
    }
  }

  async getClientById(id: number): Promise<ClientResponseDTO | null> {
    try {
      const client = await this.clientRepository.getById(id);
      if (!client) {
        return null;
      }
      return new ClientResponseDTO(client);
    } catch (error) {
      console.error(`Error fetching client with ID: ${id}`, error);
      throw new Error('Failed to fetch client');
    }
  }

  async updateClient(
    id: number,
    client: ClientRequestDTO,
  ): Promise<ClientResponseDTO | null> {
    try {
      const updatedClient = clientFactory.createClientFromRequestDTO(client);
      const result = await this.clientRepository.update(id, updatedClient);
      if (!result) {
        return null;
      }
      return new ClientResponseDTO(result);
    } catch (error) {
      console.error(`Error updating client with ID: ${id}`, error);
      throw new Error('Failed to update client');
    }
  }

  async deleteClient(id: number): Promise<ClientResponseDTO | null> {
    try {
      const deletedClient = await this.clientRepository.delete(id);
      if (!deletedClient) {
        return null;
      }
      return new ClientResponseDTO(deletedClient);
    } catch (error) {
      console.error(`Error deleting client with ID: ${id}`, error);
      throw new Error('Failed to delete client');
    }
  }

  async getAllClients(): Promise<ClientResponseDTO[]> {
    try {
      const clients = await this.clientRepository.getAll();
      return clients.map((client) => new ClientResponseDTO(client));
    } catch (error) {
      console.error('Error fetching all clients:', error);
      throw new Error('Failed to fetch clients');
    }
  }
}
