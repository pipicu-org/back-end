import { ProductMapper } from '../../src/api/models/mappers/productMapper';
import { Product } from '../../src/api/models/entity/product';
import { ProductResponseDTO } from '../../src/api/models/DTO/response/productResponseDTO';
import { ProductSearchResponseDTO } from '../../src/api/models/DTO/response/productSearchResponseDTO';

const mockCategoryRepository = {
  findOneBy: jest.fn(),
};

const mockIngredientRepository = {
  find: jest.fn(),
};

describe('ProductMapper', () => {
  let productMapper: ProductMapper;

  beforeEach(() => {
    jest.clearAllMocks();
    productMapper = new ProductMapper(
      mockCategoryRepository as any,
      mockIngredientRepository as any,
    );
  });

  describe('toResponseDTO', () => {
    it('should map product to response DTO', () => {
      const product: Product = {
        id: 1,
        name: 'Product',
        price: 10,
        category: { id: 1, name: 'Cat' } as any,
        recipe: { recipeIngredient: [] } as any,
      } as Product;

      const result = productMapper.toResponseDTO(product);

      expect(result).toBeInstanceOf(ProductResponseDTO);
      expect(result.id).toBe(product.id);
      expect(result.name).toBe(product.name);
      expect(result.price).toBe(product.price);
    });
  });

  describe('searchToResponseDTO', () => {
    it('should create search response DTO', () => {
      const products: Product[] = [{ id: 1, name: 'Product', preTaxPrice: 8, price: 10, category: { name: 'Cat' } as any } as Product];
      const search = 'Prod';
      const page = 1;
      const limit = 10;
      const total = 1;

      const result = productMapper.searchToResponseDTO([products, total], search, page, limit);

      expect(result).toBeInstanceOf(ProductSearchResponseDTO);
      expect(result.search).toBe(search);
      expect(result.total).toBe(total);
      expect(result.page).toBe(page);
      expect(result.limit).toBe(limit);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].preTaxPrice).toBe(8);
    });
  });
});