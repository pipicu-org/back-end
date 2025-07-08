import { ClientRequestDTO } from '../models/DTO/request/clientRequestDTO';
import { ClientResponseDTO } from '../models/DTO/response/clientResponseDTO';
import { ClientSearchResponseDTO } from '../models/DTO/response/clientSearchResponseDTO';
import { ClientMapper } from '../models/mappers/clientMapper';
import { ICLientRepository } from './client.repository';

export interface IClientService {
  createClient(client: ClientRequestDTO): Promise<ClientResponseDTO>;
  getClientById(id: number): Promise<ClientResponseDTO | null>;
  updateClient(
    id: number,
    client: ClientRequestDTO,
  ): Promise<ClientResponseDTO | null>;
  deleteClient(id: number): Promise<ClientResponseDTO | null>;
  searchClients(
    search: string,
    page: number,
    limit: number,
  ): Promise<ClientSearchResponseDTO | []>;
}

export class ClientService implements IClientService {
  constructor(
    private readonly _clientRepository: ICLientRepository,
    private readonly _clientMapper: ClientMapper,
  ) {}

  async createClient(client: ClientRequestDTO): Promise<ClientResponseDTO> {
    try {
      const newClient = this._clientMapper.createClientFromRequestDTO(client);
      return await this._clientRepository.create(newClient);
    } catch (error) {
      console.error('Error creating client:', error);
      throw new Error('Failed to create client');
    }
  }

  async getClientById(id: number): Promise<ClientResponseDTO | null> {
    try {
      return await this._clientRepository.getById(id);
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
      const newClient = this._clientMapper.createClientFromRequestDTO(client);
      return await this._clientRepository.update(id, newClient);
    } catch (error) {
      console.error(`Error updating client with ID: ${id}`, error);
      throw new Error('Failed to update client');
    }
  }

  async deleteClient(id: number): Promise<ClientResponseDTO | null> {
    try {
      return (await this._clientRepository.delete(id)) ?? null;
    } catch (error) {
      console.error(`Error deleting client with ID: ${id}`, error);
      throw new Error('Failed to delete client');
    }
  }

  async searchClients(
    search: string,
    page: number,
    limit: number,
  ): Promise<ClientSearchResponseDTO | []> {
    try {
      return await this._clientRepository.searchByName(search, page, limit);
    } catch (error) {
      console.error(`Error searching clients with query "${search}":`, error);
      throw new Error('Failed to search clients');
    }
  }
}
