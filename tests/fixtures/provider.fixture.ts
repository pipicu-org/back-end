import { ProviderRequestDTO } from '../../src/api/models/DTO/request/providerRequestDTO';
import { ProviderResponseDTO } from '../../src/api/models/DTO/response/providerResponseDTO';

export const mockProviderRequestDTO = new ProviderRequestDTO(
  'ABC Supplies',
  'Provider of office supplies',
);

export const mockProviderResponseDTO: ProviderResponseDTO = {
  id: 1,
  name: 'ABC Supplies',
  description: 'Provider of office supplies',
  createdAt: new Date('2023-01-01T00:00:00Z'),
  updatedAt: new Date('2023-01-01T00:00:00Z'),
};