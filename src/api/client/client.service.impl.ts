import { ClientRequestDTO } from '../models/DTO/request/clientRequestDTO';
import { ClientResponseDTO } from '../models/DTO/response/clientResponseDTO';
import { ClientSearchResponseDTO } from '../models/DTO/response/clientSearchResponseDTO';
import { ClientMapper } from '../models/mappers/clientMapper';
import { ICLientRepository } from './client.repository';
import { IClientService } from './client.service';

export class ClientService implements IClientService {
  constructor(
    private readonly _clientRepository: ICLientRepository,
    private readonly _clientMapper: ClientMapper,
  ) {}

  async createClient(client: ClientRequestDTO): Promise<ClientResponseDTO> {
    const newClient = this._clientMapper.createClientFromRequestDTO(client);
    return await this._clientRepository.create(newClient);
  }

  async getClientById(id: number): Promise<ClientResponseDTO | void> {
    return await this._clientRepository.getById(id);
  }

  async updateClient(
    id: number,
    client: ClientRequestDTO,
  ): Promise<ClientResponseDTO | void> {
    const newClient = this._clientMapper.createClientFromRequestDTO(client);
    return await this._clientRepository.update(id, newClient);
  }

  async deleteClient(id: number): Promise<ClientResponseDTO | void> {
    return await this._clientRepository.delete(id);
  }

  async searchClients(
    search: string,
    page: number,
    limit: number,
  ): Promise<ClientSearchResponseDTO> {
    return await this._clientRepository.searchByName(search, page, limit);
  }
}