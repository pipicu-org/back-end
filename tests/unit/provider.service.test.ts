import { ProviderService } from '../../src/api/provider/provider.service.impl';
import { mockProviderRequestDTO, mockProviderResponseDTO } from '../fixtures/provider.fixture';

const mockProviderRepository = {
  create: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  searchProvider: jest.fn(),
};

const mockProviderMapper = {
  requestDTOToEntity: jest.fn(),
};

jest.mock('../../src/api/provider/provider.repository', () => ({
  ProviderRepository: jest.fn().mockImplementation(() => mockProviderRepository),
}));

jest.mock('../../src/api/models/mappers/providerMapper', () => ({
  ProviderMapper: jest.fn().mockImplementation(() => mockProviderMapper),
}));

describe('ProviderService', () => {
  let providerService: ProviderService;

  beforeEach(() => {
    jest.clearAllMocks();
    providerService = new ProviderService(mockProviderRepository as any, mockProviderMapper as any);
  });

  describe('createProvider', () => {
    it('should create a provider successfully', async () => {
      const mockEntity = { id: 1, ...mockProviderRequestDTO };
      mockProviderMapper.requestDTOToEntity.mockReturnValue(mockEntity);
      mockProviderRepository.create.mockResolvedValue(mockProviderResponseDTO);

      const result = await providerService.createProvider(mockProviderRequestDTO);

      expect(mockProviderMapper.requestDTOToEntity).toHaveBeenCalledWith(mockProviderRequestDTO);
      expect(mockProviderRepository.create).toHaveBeenCalledWith(mockEntity);
      expect(result).toEqual(mockProviderResponseDTO);
    });

    it('should propagate error on creation failure', async () => {
      const error = new Error('Database error');
      mockProviderMapper.requestDTOToEntity.mockReturnValue({});
      mockProviderRepository.create.mockRejectedValue(error);

      await expect(providerService.createProvider(mockProviderRequestDTO)).rejects.toThrow(error);
    });
  });

  describe('getProviderById', () => {
    it('should return provider by ID', async () => {
      mockProviderRepository.findById.mockResolvedValue(mockProviderResponseDTO);

      const result = await providerService.getProviderById(1);

      expect(mockProviderRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockProviderResponseDTO);
    });
  });

  describe('searchProviders', () => {
    it('should search providers', async () => {
      const searchResult = { data: [mockProviderResponseDTO], total: 1, page: 1, limit: 10, search: '' };
      mockProviderRepository.searchProvider.mockResolvedValue(searchResult);

      const result = await providerService.searchProviders('', 1, 10, 'name');

      expect(mockProviderRepository.searchProvider).toHaveBeenCalledWith('', 1, 10, 'name');
      expect(result).toEqual(searchResult);
    });
  });

  describe('updateProvider', () => {
    it('should update provider successfully', async () => {
      const mockEntity = { id: 1, ...mockProviderRequestDTO };
      mockProviderMapper.requestDTOToEntity.mockReturnValue(mockEntity);
      mockProviderRepository.update.mockResolvedValue(mockProviderResponseDTO);

      const result = await providerService.updateProvider(1, mockProviderRequestDTO);

      expect(mockProviderMapper.requestDTOToEntity).toHaveBeenCalledWith(mockProviderRequestDTO);
      expect(mockProviderRepository.update).toHaveBeenCalledWith(1, mockEntity);
      expect(result).toEqual(mockProviderResponseDTO);
    });
  });

  describe('deleteProvider', () => {
    it('should delete provider successfully', async () => {
      mockProviderRepository.findById.mockResolvedValue(mockProviderResponseDTO);
      mockProviderRepository.delete.mockResolvedValue(mockProviderResponseDTO);

      const result = await providerService.deleteProvider(1);

      expect(mockProviderRepository.findById).toHaveBeenCalledWith(1);
      expect(mockProviderRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockProviderResponseDTO);
    });
  });
});