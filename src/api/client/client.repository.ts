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
  ): Promise<ClientSearchResponseDTO | []>;
  getById(id: number): Promise<ClientResponseDTO | null>;
  create(client: Client): Promise<ClientResponseDTO>;
  update(id: number, client: Client): Promise<ClientResponseDTO | null>;
  delete(id: number): Promise<ClientResponseDTO | void>;
}

export class ClientRepository implements ICLientRepository {
  constructor(
    private readonly dbClientRepository: Repository<Client>,
    private readonly _clientMapper: ClientMapper,
  ) {}

  async searchByName(
    search: string,
    page: number,
    limit: number,
  ): Promise<ClientSearchResponseDTO | []> {
    try {
      const clients = await this.dbClientRepository
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
      return [];
    }
  }

  async getById(id: number): Promise<ClientResponseDTO | null> {
    try {
      return await this.dbClientRepository
        .createQueryBuilder('client')
        .leftJoinAndSelect('client.orders', 'order')
        .where('client.id = :id', { id })
        .getOne()
        .then((client) => {
          return client ? new ClientResponseDTO(client) : null;
        });
    } catch (error) {
      console.error(`Error fetching client with id ${id}:`, error);
      return null;
    }
  }

  async create(client: Client): Promise<ClientResponseDTO> {
    try {
      return await this.dbClientRepository.save(client).then((savedClient) => {
        return new ClientResponseDTO(savedClient);
      });
    } catch (error) {
      console.error('Error creating client:', error);
      throw new Error('Could not create client');
    }
  }

  async update(id: number, client: Client): Promise<ClientResponseDTO | null> {
    try {
      const existingClient = await this.dbClientRepository.update(id, client);
      if (existingClient.affected === 0) {
        console.warn(`No client found with id ${id} to update`);
        return null;
      }
      return existingClient ? new ClientResponseDTO({ ...client, id }) : null;
    } catch (error) {
      console.error(`Error updating client with id ${id}:`, error);
      return null;
    }
  }

  async delete(id: number): Promise<ClientResponseDTO | void> {
    try {
      const clientFounded = await this.dbClientRepository.findOneBy({ id });
      if (clientFounded) {
        await this.dbClientRepository.delete(id);
        return new ClientResponseDTO(clientFounded);
      } else {
        console.warn(`No client found with id ${id} to delete`);
        return;
      }
    } catch (error) {
      console.error(`Error deleting client with id ${id}:`, error);
    }
  }
}
