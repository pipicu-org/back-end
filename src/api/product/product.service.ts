import { ProductRequestDTO } from '../models/DTO/request/productRequestDTO';
import { ProductResponseDTO } from '../models/DTO/response/productResponseDTO';
import { IProductRepository } from './product.repository';
import { ProductSearchResponseDTO } from '../models/DTO/response/productSearchResponseDTO';
import { ProductMapper } from '../models/mappers/productMapper';

/**
 * Interface for Product Service operations.
 * Defines the contract for product-related business logic.
 */
export interface IProductService {
  /**
   * Retrieves products by name with pagination.
   * @param name - The name to search for.
   * @param page - The page number for pagination.
   * @param limit - The number of results per page.
   * @returns Promise resolving to the search results.
   */
  getByName(
    name: string,
    page: number,
    limit: number,
  ): Promise<ProductSearchResponseDTO>;

  /**
   * Retrieves a product by ID.
   * @param id - The unique identifier of the product.
   * @returns Promise resolving to the product response DTO.
   */
  getProductById(id: number): Promise<ProductResponseDTO>;

  /**
   * Creates a new product.
   * @param product - The product data to create.
   * @returns Promise resolving to the created product response DTO.
   */
  createProduct(product: ProductRequestDTO): Promise<ProductResponseDTO>;

  /**
   * Updates an existing product.
   * @param id - The unique identifier of the product to update.
   * @param product - The updated product data.
   * @returns Promise resolving to the updated product response DTO.
   */
  updateProduct(
    id: number,
    product: ProductRequestDTO,
  ): Promise<ProductResponseDTO>;

  /**
   * Deletes a product by ID.
   * @param id - The unique identifier of the product to delete.
   * @returns Promise resolving to the deleted product response DTO.
   */
  deleteProduct(id: number): Promise<ProductResponseDTO>;

  /**
   * Retrieves products by category ID with pagination.
   * @param categoryId - The unique identifier of the category.
   * @param page - The page number for pagination.
   * @param limit - The number of results per page.
   * @returns Promise resolving to the search results.
   */
  getProductsByCategoryId(
    categoryId: number,
    page: number,
    limit: number,
  ): Promise<ProductSearchResponseDTO>;
}

/**
 * Service class for handling product business logic.
 * Implements the IProductService interface and follows SOLID principles:
 * - Single Responsibility: Handles only product-related operations.
 * - Dependency Inversion: Depends on abstractions (interfaces) rather than concretions.
 */
export class ProductService implements IProductService {
  /**
   * Constructs a new ProductService instance.
   * @param _productRepository - The repository for product data access.
   * @param _productMapper - The mapper for transforming product data.
   */
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
    const productEntity = await this._productMapper.requestDTOToEntity(product);
    return await this._productRepository.create(productEntity);
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
}
