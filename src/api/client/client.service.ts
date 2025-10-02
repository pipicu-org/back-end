import { ClientRequestDTO } from '../models/DTO/request/clientRequestDTO';
import { ClientResponseDTO } from '../models/DTO/response/clientResponseDTO';
import { ClientSearchResponseDTO } from '../models/DTO/response/clientSearchResponseDTO';
import { ClientMapper } from '../models/mappers/clientMapper';
import { ICLientRepository } from './client.repository';

/**
 * Interface for Client Service operations.
 * Defines the contract for client-related business logic.
 */
export interface IClientService {
  /**
   * Creates a new client.
   * @param client - The client data to create.
   * @returns Promise resolving to the created client response DTO.
   */
  createClient(client: ClientRequestDTO): Promise<ClientResponseDTO>;

  /**
   * Retrieves a client by ID.
   * @param id - The unique identifier of the client.
   * @returns Promise resolving to the client response DTO or undefined if not found.
   */
  getClientById(id: number): Promise<ClientResponseDTO | void>;

  /**
   * Updates an existing client.
   * @param id - The unique identifier of the client to update.
   * @param client - The updated client data.
   * @returns Promise resolving to the updated client response DTO or undefined if not found.
   */
  updateClient(
    id: number,
    client: ClientRequestDTO,
  ): Promise<ClientResponseDTO | void>;

  /**
   * Deletes a client by ID.
   * @param id - The unique identifier of the client to delete.
   * @returns Promise resolving to the deleted client response DTO or undefined if not found.
   */
  deleteClient(id: number): Promise<ClientResponseDTO | void>;

  /**
   * Searches for clients by name with pagination.
   * @param search - The search term for client names.
   * @param page - The page number for pagination.
   * @param limit - The number of results per page.
   * @returns Promise resolving to the search results.
   */
  searchClients(
    search: string,
    page: number,
    limit: number,
  ): Promise<ClientSearchResponseDTO>;
}

/**
 * Service class for handling client business logic.
 * Implements the IClientService interface and follows SOLID principles:
 * - Single Responsibility: Handles only client-related operations.
 * - Dependency Inversion: Depends on abstractions (interfaces) rather than concretions.
 */
export class ClientService implements IClientService {
  /**
   * Constructs a new ClientService instance.
   * @param _clientRepository - The repository for client data access.
   * @param _clientMapper - The mapper for transforming client data.
   */
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
