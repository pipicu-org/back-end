import { ProviderRequestDTO } from '../DTO/request/providerRequestDTO';
import { ProviderResponseDTO } from '../DTO/response/providerResponseDTO';
import { ProviderSearchResponseDTO } from '../DTO/response/providerSearchResponseDTO';
import { Provider } from '../entity/provider';

export interface IProviderEntityMapper {
  requestDTOToEntity(requestDTO: ProviderRequestDTO): Provider;
  toEntity(provider: ProviderResponseDTO): Provider;
}

export interface IProviderResponseMapper {
  toResponseDTO(provider: Provider): ProviderResponseDTO;
}

export interface IProviderSearchMapper {
  createSearchToProviderSearchDTO(
    resultsAndCount: [Provider[], number],
    search: string,
    page: number,
    limit: number,
  ): ProviderSearchResponseDTO;
}

export class ProviderMapper implements IProviderEntityMapper, IProviderResponseMapper, IProviderSearchMapper {
  public toResponseDTO(provider: Provider): ProviderResponseDTO {
    return new ProviderResponseDTO(provider);
  }

  public requestDTOToEntity(requestDTO: ProviderRequestDTO): Provider {
    const provider = new Provider();
    provider.name = requestDTO.name;
    provider.description = requestDTO.description as any;
    return provider;
  }

  public toEntity(provider: ProviderResponseDTO): Provider {
    const entity = new Provider();
    entity.id = provider.id;
    entity.name = provider.name;
    entity.description = provider.description as any;
    entity.createdAt = provider.createdAt;
    entity.updatedAt = provider.updatedAt;
    return entity;
  }

  public createSearchToProviderSearchDTO(
    resultsAndCount: [Provider[], number],
    search: string,
    page: number,
    limit: number,
  ): ProviderSearchResponseDTO {
    return new ProviderSearchResponseDTO(
      search,
      resultsAndCount[1],
      page,
      limit,
      resultsAndCount[0].map((provider) => ({
        id: provider.id.toString(),
        name: provider.name,
        description: provider.description || undefined,
        createdAt: provider.createdAt,
        updatedAt: provider.updatedAt,
      })),
    );
  }
}