import { ProviderRequestDTO } from '../models/DTO/request/providerRequestDTO';
import { ProviderResponseDTO } from '../models/DTO/response/providerResponseDTO';
import { ProviderSearchResponseDTO } from '../models/DTO/response/providerSearchResponseDTO';
import { ProviderMapper } from '../models/mappers/providerMapper';
import { IProviderRepository } from './provider.repository';
import { IProviderService } from './provider.service';
import logger from '../../config/logger';

export class ProviderService implements IProviderService {
  constructor(
    private readonly _repository: IProviderRepository,
    private readonly _providerMapper: ProviderMapper,
  ) {}

  async createProvider(
    requestDTO: ProviderRequestDTO,
  ): Promise<ProviderResponseDTO | void> {
    try {
      const provider = this._providerMapper.requestDTOToEntity(requestDTO);
      const createdProvider = await this._repository.create(provider);
      return createdProvider;
    } catch (error: any) {
      logger.error('Error creating provider', { error: error.message, stack: error.stack });
      throw error;
    }
  }

  async getProviderById(id: number): Promise<ProviderResponseDTO | void> {
    try {
      const provider = await this._repository.findById(id);
      return provider;
    } catch (error: any) {
      logger.error('Error fetching provider by ID', { id, error: error.message, stack: error.stack });
      throw error;
    }
  }

  async searchProviders(
    search: string,
    page: number,
    limit: number,
    sort: string,
  ): Promise<ProviderSearchResponseDTO | void> {
    try {
      return await this._repository.searchProvider(search, page, limit, sort);
    } catch (error: any) {
      logger.error('Error searching providers', { search, page, limit, sort, error: error.message, stack: error.stack });
      throw error;
    }
  }

  async updateProvider(
    id: number,
    requestDTO: ProviderRequestDTO,
  ): Promise<ProviderResponseDTO | void> {
    try {
      const updatedProvider =
        this._providerMapper.requestDTOToEntity(requestDTO);
      const provider = await this._repository.update(id, updatedProvider);
      return provider;
    } catch (error: any) {
      logger.error('Error updating provider', { id, error: error.message, stack: error.stack });
      throw error;
    }
  }

  async deleteProvider(id: number): Promise<ProviderResponseDTO | void> {
    try {
      const provider = await this._repository.findById(id);
      await this._repository.delete(id);
      return provider;
    } catch (error: any) {
      logger.error('Error deleting provider', { id, error: error.message, stack: error.stack });
      throw error;
    }
  }
}