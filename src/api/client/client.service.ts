export interface IClientService {
  createClient(client: import('../models/DTO/request/clientRequestDTO').ClientRequestDTO): Promise<import('../models/DTO/response/clientResponseDTO').ClientResponseDTO>;

  getClientById(id: number): Promise<import('../models/DTO/response/clientResponseDTO').ClientResponseDTO | void>;

  updateClient(
    id: number,
    client: import('../models/DTO/request/clientRequestDTO').ClientRequestDTO,
  ): Promise<import('../models/DTO/response/clientResponseDTO').ClientResponseDTO | void>;

  deleteClient(id: number): Promise<import('../models/DTO/response/clientResponseDTO').ClientResponseDTO | void>;

  searchClients(
    search: string,
    page: number,
    limit: number,
  ): Promise<import('../models/DTO/response/clientSearchResponseDTO').ClientSearchResponseDTO>;
}
