import { ClientRequestDTO } from '../models/DTO/request/clientRequestDTO';
import { ClientResponseDTO } from '../models/DTO/response/clientResponseDTO';
import { ClientSearchResponseDTO } from '../models/DTO/response/clientSearchResponseDTO';

export interface IClientService {
  createClient(client: ClientRequestDTO): Promise<ClientResponseDTO>;

  getClientById(id: number): Promise<ClientResponseDTO | void>;

  updateClient(
    id: number,
    client: ClientRequestDTO,
  ): Promise<ClientResponseDTO | void>;

  deleteClient(id: number): Promise<ClientResponseDTO | void>;

  searchClients(
    search: string,
    page: number,
    limit: number,
  ): Promise<ClientSearchResponseDTO>;
}
