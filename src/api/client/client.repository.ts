import { Repository } from 'typeorm';
import { Client } from '../models/entity';
import { ClientResponseDTO } from '../models/DTO/response/clientResponseDTO';
import { ClientSearchResponseDTO } from '../models/DTO/response/clientSearchResponseDTO';
import { ClientMapper } from '../models/mappers/clientMapper';
import { HttpError } from '../../errors/httpError';
import logger from '../../config/logger';

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
    } catch (error: any) {
      logger.error('Error searching clients by name', { search, error: error.message, stack: error.stack });
      throw new HttpError(500, 'Failed to search clients by name');
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
            throw new HttpError(404, `Client with id ${id} not found`);
          }
        });
    } catch (error: any) {
      logger.error('Error fetching client by ID', { id, error: error.message, stack: error.stack });
      throw new HttpError(
        error.status || 500,
        error.message || 'Failed to fetch client',
      );
    }
  }

  async create(client: Client): Promise<ClientResponseDTO> {
    try {
      return await this._dbClientRepository.save(client).then((savedClient) => {
        return this._clientMapper.toResponseDTO(savedClient);
      });
    } catch (error: any) {
      logger.error('Error creating client', { error: error.message, stack: error.stack });
      throw new HttpError(
        error.status || 500,
        error.message || 'Failed to create client',
      );
    }
  }

  async update(id: number, client: Client): Promise<ClientResponseDTO | void> {
    try {
      const existingClient = await this._dbClientRepository.update(id, client);
      if (existingClient.affected === 0) {
        throw new HttpError(404, `Client with id ${id} not found`);
      }
      return this._clientMapper.toResponseDTO({ ...client, id });
    } catch (error: any) {
      logger.error('Error updating client', { id, error: error.message, stack: error.stack });
      throw new HttpError(
        error.status || 500,
        error.message || `Failed to update client with id ${id}`,
      );
    }
  }

  async delete(id: number): Promise<ClientResponseDTO | void> {
    try {
      const client = await this._dbClientRepository.findOneBy({ id });
      if (client) {
        await this._dbClientRepository.delete(id);
        return this._clientMapper.toResponseDTO(client);
      } else {
        throw new HttpError(404, `Client with id ${id} not found`);
      }
    } catch (error: any) {
      logger.error('Error deleting client', { id, error: error.message, stack: error.stack });
      throw new HttpError(
        error.status || 500,
        error.message || `Failed to delete client with id ${id}`,
      );
    }
  }
}
