import { ProviderRequestDTO } from '../models/DTO/request/providerRequestDTO';
import { ProviderResponseDTO } from '../models/DTO/response/providerResponseDTO';
import { ProviderSearchResponseDTO } from '../models/DTO/response/providerSearchResponseDTO';

export interface IProviderService {
  createProvider(
    requestDTO: ProviderRequestDTO,
  ): Promise<ProviderResponseDTO | void>;
  getProviderById(id: number): Promise<ProviderResponseDTO | void>;
  searchProviders(
    search: string,
    page: number,
    limit: number,
    sort: string,
  ): Promise<ProviderSearchResponseDTO | void>;
  updateProvider(
    id: number,
    requestDTO: ProviderRequestDTO,
  ): Promise<ProviderResponseDTO | void>;
  deleteProvider(id: number): Promise<ProviderResponseDTO | void>;
}