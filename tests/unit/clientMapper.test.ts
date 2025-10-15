import { ClientMapper } from '../../src/api/models/mappers/clientMapper';
import { mockClientRequestDTO, mockClientEntity, mockClientResponseDTO } from '../fixtures/client.fixture';
import { Client } from '../../src/api/models/entity/client';
import { ClientSearchResponseDTO } from '../../src/api/models/DTO/response/clientSearchResponseDTO';
import { ClientResponseDTO } from '../../src/api/models/DTO/response/clientResponseDTO';

describe('ClientMapper', () => {
  let clientMapper: ClientMapper;

  beforeEach(() => {
    clientMapper = new ClientMapper();
  });

  describe('createClientFromRequestDTO', () => {
    it('should create a client entity from request DTO', () => {
      const result = clientMapper.createClientFromRequestDTO(mockClientRequestDTO);

      expect(result).toBeInstanceOf(Client);
      expect(result.name).toBe(mockClientRequestDTO.name);
      expect(result.phoneNumber).toBe(mockClientRequestDTO.phoneNumber);
      expect(result.address).toBe(mockClientRequestDTO.address);
      expect(result.facebookUsername).toBe(mockClientRequestDTO.facebookUsername);
      expect(result.instagramUsername).toBe(mockClientRequestDTO.instagramUsername);
    });

    it('should handle null optional fields', () => {
      const requestDTO = { ...mockClientRequestDTO, facebookUsername: undefined, instagramUsername: undefined };
      const result = clientMapper.createClientFromRequestDTO(requestDTO);

      expect(result.facebookUsername).toBeNull();
      expect(result.instagramUsername).toBeNull();
    });
  });

  describe('toResponseDTO', () => {
    it('should map client entity to response DTO', () => {
      const result = clientMapper.toResponseDTO(mockClientEntity);

      expect(result).toBeInstanceOf(ClientResponseDTO);
      expect(result.id).toBe(mockClientEntity.id);
      expect(result.name).toBe(mockClientEntity.name);
      expect(result.phoneNumber).toBe(mockClientEntity.phoneNumber);
      expect(result.address).toBe(mockClientEntity.address);
      expect(result.facebookusername).toBe(mockClientEntity.facebookUsername);
      expect(result.instagramusername).toBe(mockClientEntity.instagramUsername);
    });
  });

  describe('createSearchToClientSearchDTO', () => {
    const mockClients: Client[] = [mockClientEntity];
    const search = 'John';
    const page = 1;
    const limit = 10;
    const total = 1;

    it('should create search response DTO', () => {
      const result = clientMapper.createSearchToClientSearchDTO([mockClients, total], search, page, limit);

      expect(result).toBeInstanceOf(ClientSearchResponseDTO);
      expect(result.search).toBe(search);
      expect(result.total).toBe(total);
      expect(result.page).toBe(page);
      expect(result.limit).toBe(limit);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].id).toBe('1');
      expect(result.data[0].name).toBe(mockClientEntity.name);
    });

    it('should handle clients with orders', () => {
      const clientWithOrder = { ...mockClientEntity, orders: [{ createdAt: new Date() } as any] };
      const result = clientMapper.createSearchToClientSearchDTO([[clientWithOrder], total], search, page, limit);

      expect(result.data[0].lastOrder).toBe(clientWithOrder.orders[0].createdAt.toISOString());
    });

    it('should handle clients without orders', () => {
      const result = clientMapper.createSearchToClientSearchDTO([mockClients, total], search, page, limit);

      expect(result.data[0].lastOrder).toBeNull();
    });
  });
});