import { ProductRequestDTO } from '../models/DTO/request/productRequestDTO';
import { ProductResponseDTO } from '../models/DTO/response/productResponseDTO';
import { CustomProductResponsePaginatedDTO } from '../models/DTO/response/customProductResponsePaginatedDTO';
import { IProductRepository } from './product.repository';
import { ProductSearchResponseDTO } from '../models/DTO/response/productSearchResponseDTO';
import { ProductMapper } from '../models/mappers/productMapper';
import { IProductService } from './product.service';

export class ProductService implements IProductService {
  constructor(
    private readonly _productRepository: IProductRepository,
    private readonly _productMapper: ProductMapper,
  ) {}

  async getProductById(id: number): Promise<ProductResponseDTO> {
    return this._productRepository.findById(id);
  }

  async getByName(
    name: string,
    page: number,
    limit: number,
  ): Promise<ProductSearchResponseDTO> {
    return this._productRepository.getByName(name, page, limit);
  }

  async createProduct(product: ProductRequestDTO): Promise<ProductResponseDTO> {
    try {
      const productEntity =
        await this._productMapper.requestDTOToEntity(product);
      return await this._productRepository.create(productEntity);
    } catch (error: any) {
      throw new Error(`${error.message}`);
    }
  }

  async updateProduct(
    id: number,
    product: ProductRequestDTO,
  ): Promise<ProductResponseDTO> {
    const productEntity = await this._productMapper.requestDTOToEntity(product);
    return await this._productRepository.update(id, productEntity);
  }

  async deleteProduct(id: number): Promise<ProductResponseDTO> {
    return await this._productRepository.delete(id);
  }

  async getProductsByCategoryId(
    categoryId: number,
    page: number,
    limit: number,
  ): Promise<ProductSearchResponseDTO> {
    return await this._productRepository.getByCategoryId(
      categoryId,
      page,
      limit,
    );
  }

  /**
   * Retrieves all custom products with pagination.
   * @param page The page number to retrieve (1-based).
   * @param limit The number of items per page.
   * @returns A Promise that resolves to the CustomProductResponsePaginatedDTO containing the paginated results.
   */
  async getAllCustomProducts(
    page: number,
    limit: number,
  ): Promise<CustomProductResponsePaginatedDTO> {
    return this._productRepository.getAllCustomProducts(page, limit);
  }
}
