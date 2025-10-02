import { ClientService } from '../../src/api/client/client.service';
import { ClientMapper } from '../../src/api/models/mappers/clientMapper';
import { mockClientRequestDTO, mockClientEntity, mockClientResponseDTO } from '../fixtures/client.fixture';

const mockClientRepository = {
  create: jest.fn(),
  getById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  searchByName: jest.fn(),
};

const mockClientMapper = {
  createClientFromRequestDTO: jest.fn(),
  toResponseDTO: jest.fn(),
};

jest.mock('../../src/api/client/client.repository', () => ({
  ClientRepository: jest.fn().mockImplementation(() => mockClientRepository),
}));

jest.mock('../../src/api/models/mappers/clientMapper', () => ({
  ClientMapper: jest.fn().mockImplementation(() => mockClientMapper),
}));

describe('ClientService', () => {
  let clientService: ClientService;

  beforeEach(() => {
    jest.clearAllMocks();
    clientService = new ClientService(mockClientRepository as any, mockClientMapper as any);
  });

  describe('createClient', () => {
    it('should create a client successfully', async () => {
      mockClientMapper.createClientFromRequestDTO.mockReturnValue(mockClientEntity);
      mockClientRepository.create.mockResolvedValue(mockClientResponseDTO);

      const result = await clientService.createClient(mockClientRequestDTO);

      expect(mockClientMapper.createClientFromRequestDTO).toHaveBeenCalledWith(mockClientRequestDTO);
      expect(mockClientRepository.create).toHaveBeenCalledWith(mockClientEntity);
      expect(result).toEqual(mockClientResponseDTO);
    });

    it('should propagate error on creation failure', async () => {
      const error = new Error('Database error');

      mockClientMapper.createClientFromRequestDTO.mockReturnValue(mockClientEntity);
      mockClientRepository.create.mockRejectedValue(error);

      await expect(clientService.createClient(mockClientRequestDTO)).rejects.toThrow(error);
    });
  });

  // Add more test cases for other methods
});