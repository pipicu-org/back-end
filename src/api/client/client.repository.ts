import { Repository } from 'typeorm';
import { Client } from '../models';

export interface ICLientRepository {
  getAll(): Promise<Client[]>;
  getById(id: number): Promise<Client | null>;
  create(client: Client): Promise<Client>;
  update(id: number, client: Client): Promise<Client | null>;
  delete(id: number): Promise<Client | void>;
}

export class ClientRepository implements ICLientRepository {
  constructor(private readonly dbClientRepository: Repository<Client>) {}

  async getAll(): Promise<Client[]> {
    try {
      return await this.dbClientRepository.find();
    } catch (error) {
      console.error('Error fetching all clients:', error);
      return [];
    }
  }

  async getById(id: number): Promise<Client | null> {
    try {
      return await this.dbClientRepository.findOneBy({ id });
    } catch (error) {
      console.error(`Error fetching client with id ${id}:`, error);
      return null;
    }
  }

  async create(client: Client): Promise<Client> {
    try {
      return await this.dbClientRepository.save(client);
    } catch (error) {
      console.error('Error creating client:', error);
      throw new Error('Could not create client');
    }
  }

  async update(id: number, client: Client): Promise<Client | null> {
    try {
      const existingClient = await this.dbClientRepository.update(id, client);
      if (existingClient.affected === 0) {
        console.warn(`No client found with id ${id} to update`);
        return null;
      }
      return await this.dbClientRepository.findOneBy({ id });
    } catch (error) {
      console.error(`Error updating client with id ${id}:`, error);
      return null;
    }
  }

  async delete(id: number): Promise<Client | void> {
    try {
      const existingClient = await this.dbClientRepository.findOneBy({ id });
      if (existingClient) {
        await this.dbClientRepository.delete(id);
        return existingClient;
      } else {
        console.warn(`No client found with id ${id} to delete`);
        return;
      }
    } catch (error) {
      console.error(`Error deleting client with id ${id}:`, error);
    }
  }
}
