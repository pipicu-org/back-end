import { Repository } from 'typeorm';
import { Provider } from '../models/entity/provider';
import { ProviderSearchResponseDTO } from '../models/DTO/response/providerSearchResponseDTO';
import { ProviderMapper } from '../models/mappers/providerMapper';
import { ProviderResponseDTO } from '../models/DTO/response/providerResponseDTO';
import { HttpError } from '../../errors/httpError';

export interface IProviderRepository {
  searchProvider(
    search: string,
    page: number,
    limit: number,
    sort: string,
  ): Promise<ProviderSearchResponseDTO | void>;
  findById(id: number): Promise<ProviderResponseDTO | void>;
  create(provider: Provider): Promise<ProviderResponseDTO | void>;
  update(
    id: number,
    provider: Provider,
  ): Promise<ProviderResponseDTO | void>;
  delete(id: number): Promise<ProviderResponseDTO | void>;
}

export class ProviderRepository implements IProviderRepository {
  constructor(
    private readonly _dbProviderRepository: Repository<Provider>,
    private readonly _providerMapper: ProviderMapper,
  ) {}

  async searchProvider(
    search: string,
    page: number,
    limit: number,
    sort: string = 'name',
  ): Promise<ProviderSearchResponseDTO | void> {
    try {
      const allowedSorts = ['name', 'createdAt'];
      const sortField = allowedSorts.includes(sort) ? sort : 'name';
      const results = await this._dbProviderRepository
        .createQueryBuilder('provider')
        .where('provider.name ILIKE :search', { search: `%${search}%` })
        .orderBy(`provider.${sortField}`, 'ASC')
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();
      return this._providerMapper.createSearchToProviderSearchDTO(
        results,
        search,
        page,
        limit,
      );
    } catch (error: any) {
      console.error('Error fetching all providers:', error);
      throw new HttpError(
        error.status || 500,
        error.message || 'Internal Server Error',
      );
    }
  }

  async findById(id: number): Promise<ProviderResponseDTO | void> {
    try {
      const provider = await this._dbProviderRepository.findOneBy({ id });
      if (!provider) {
        throw new HttpError(404, `Provider with id ${id} not found`);
      }
      return this._providerMapper.toResponseDTO(provider);
    } catch (error: any) {
      console.error(`Error fetching provider with id ${id}:`, error);
      throw new HttpError(
        error.status || 500,
        error.message || `Could not fetch provider with id ${id}`,
      );
    }
  }

  async create(provider: Provider): Promise<ProviderResponseDTO | void> {
    try {
      const createdProvider =
        await this._dbProviderRepository.save(provider);
      return this._providerMapper.toResponseDTO(createdProvider);
    } catch (error: any) {
      console.error('Error creating provider:', error);
      throw new HttpError(
        error.status || 500,
        error.message || 'Could not create provider',
      );
    }
  }

  async update(
    id: number,
    provider: Provider,
  ): Promise<ProviderResponseDTO | void> {
    try {
      const existingProvider = await this._dbProviderRepository.update(
        id,
        provider,
      );
      if (existingProvider.affected === 0) {
        throw new Error(`Provider with id ${id} not found`);
      }
      const updatedProvider = await this._dbProviderRepository
        .createQueryBuilder('provider')
        .where('provider.id = :id', { id })
        .getOne();
      if (!updatedProvider) {
        throw new HttpError(404, `Provider with id ${id} not found`);
      }
      return this._providerMapper.toResponseDTO(updatedProvider);
    } catch (error: any) {
      console.error(`Error updating provider with id ${id}:`, error);
      throw new HttpError(
        error.status || 500,
        error.message || `Could not update provider with id ${id}`,
      );
    }
  }

  async delete(id: number): Promise<ProviderResponseDTO | void> {
    try {
      // Check if provider has purchases
      const hasPurchases = await this._dbProviderRepository
        .createQueryBuilder('provider')
        .leftJoin('provider.purchases', 'purchase')
        .where('provider.id = :id', { id })
        .andWhere('purchase.id IS NOT NULL')
        .getCount() > 0;
      if (hasPurchases) {
        throw new HttpError(400, 'Cannot delete provider with existing purchases');
      }

      const existingProvider = await this._dbProviderRepository.findOneBy({
        id,
      });
      if (existingProvider) {
        await this._dbProviderRepository.delete(id);
        return this._providerMapper.toResponseDTO(existingProvider);
      } else {
        throw new HttpError(404, `Provider with id ${id} not found`);
      }
    } catch (error: any) {
      console.error(`Error deleting provider with id ${id}:`, error);
      throw new HttpError(
        error.status || 500,
        error.message || `Could not delete provider with id ${id}`,
      );
    }
  }
}