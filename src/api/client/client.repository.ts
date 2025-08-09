import { Repository } from 'typeorm';
import { Client } from '../models/entity';
import { ClientResponseDTO } from '../models/DTO/response/clientResponseDTO';
import { ClientSearchResponseDTO } from '../models/DTO/response/clientSearchResponseDTO';
import { ClientMapper } from '../models/mappers/clientMapper';

export interface ICLientRepository {
  searchByName(
    search: string,
    page: number,
    limit: number,
  ): Promise<ClientSearchResponseDTO>;
  getById(id: number): Promise<ClientResponseDTO | void>;
  create(client: Client): Promise<ClientResponseDTO>;
  update(id: number, client: Client): Promise<ClientResponseDTO | void>;
  delete(id: number): Promise<ClientResponseDTO | void>;
}

export class ClientRepository implements ICLientRepository {
  constructor(
    private readonly _dbClientRepository: Repository<Client>,
    private readonly _clientMapper: ClientMapper,
  ) {}

  async searchByName(
    search: string,
    page: number,
    limit: number,
  ): Promise<ClientSearchResponseDTO> {
    try {
      const clients = await this._dbClientRepository
        .createQueryBuilder('client')
        .leftJoinAndSelect('client.orders', 'order')
        .where('client.name LIKE :search', { search: `%${search}%` })
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();
      return this._clientMapper.createSearchToClientSearchDTO(
        clients,
        search,
        page,
        limit,
      );
    } catch (error) {
      console.error(`Error searching clients by name "${search}":`, error);
      throw new Error('Failed to search clients');
    }
  }

  async getById(id: number): Promise<ClientResponseDTO | void> {
    try {
      return await this._dbClientRepository
        .createQueryBuilder('client')
        .leftJoinAndSelect('client.orders', 'order')
        .where('client.id = :id', { id })
        .getOne()
        .then((client) => {
          if (client) {
            return this._clientMapper.toResponseDTO(client);
          } else {
            throw new Error(`Client with id ${id} not found`);
          }
        });
    } catch (error) {
      console.error(`Error fetching client with id ${id}:`, error);
      throw new Error(`Could not fetch client with id ${id}`);
    }
  }

  async create(client: Client): Promise<ClientResponseDTO> {
    try {
      return await this._dbClientRepository.save(client).then((savedClient) => {
        return this._clientMapper.toResponseDTO(savedClient);
      });
    } catch (error) {
      console.error('Error creating client:', error);
      throw new Error('Could not create client');
    }
  }

  async update(id: number, client: Client): Promise<ClientResponseDTO | void> {
    try {
      const existingClient = await this._dbClientRepository.update(id, client);
      if (existingClient.affected === 0) {
        throw new Error(`Client with id ${id} not found`);
      }
      return this._clientMapper.toResponseDTO({ ...client, id });
    } catch (error) {
      console.error(`Error updating client with id ${id}:`, error);
      throw new Error(`Could not update client with id ${id}`);
    }
  }

  async delete(id: number): Promise<ClientResponseDTO | void> {
    try {
      const client = await this._dbClientRepository.findOneBy({ id });
      if (client) {
        await this._dbClientRepository.delete(id);
        return this._clientMapper.toResponseDTO(client);
      } else {
        throw new Error(`Client with id ${id} not found`);
      }
    } catch (error) {
      console.error(`Error deleting client with id ${id}:`, error);
    }
  }
}
