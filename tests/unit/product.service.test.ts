import { ProductService } from '../../src/api/product/product.service.impl';
import { mockProductRequestDTO, mockProductResponseDTO } from '../fixtures/product.fixture';

const mockProductRepository = {
  create: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  getByName: jest.fn(),
  getByCategoryId: jest.fn(),
};

const mockProductMapper = {
  requestDTOToEntity: jest.fn(),
};

jest.mock('../../src/api/product/product.repository', () => ({
  ProductRepository: jest.fn().mockImplementation(() => mockProductRepository),
}));

jest.mock('../../src/api/models/mappers/productMapper', () => ({
  ProductMapper: jest.fn().mockImplementation(() => mockProductMapper),
}));

describe('ProductService', () => {
  let productService: ProductService;

  beforeEach(() => {
    jest.clearAllMocks();
    productService = new ProductService(mockProductRepository as any, mockProductMapper as any);
  });

  describe('createProduct', () => {
    it('should create a product successfully', async () => {
      const mockEntity = { id: 1, ...mockProductRequestDTO };
      mockProductMapper.requestDTOToEntity.mockResolvedValue(mockEntity);
      mockProductRepository.create.mockResolvedValue(mockProductResponseDTO);

      const result = await productService.createProduct(mockProductRequestDTO);

      expect(mockProductMapper.requestDTOToEntity).toHaveBeenCalledWith(mockProductRequestDTO);
      expect(mockProductRepository.create).toHaveBeenCalledWith(mockEntity);
      expect(result).toEqual(mockProductResponseDTO);
    });

    it('should propagate error on creation failure', async () => {
      const error = new Error('Database error');
      mockProductMapper.requestDTOToEntity.mockResolvedValue({});
      mockProductRepository.create.mockRejectedValue(error);

      await expect(productService.createProduct(mockProductRequestDTO)).rejects.toThrow(error);
    });
  });

  // Add more test cases for other methods
});