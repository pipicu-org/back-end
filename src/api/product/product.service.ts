import { ProductRequestDTO } from '../models/DTO/request/productRequestDTO';
import { ProductResponseDTO } from '../models/DTO/response/productResponseDTO';
import { IProductRepository } from './product.repository';
import { ProductSearchResponseDTO } from '../models/DTO/response/productSearchResponseDTO';
import { ProductMapper } from '../models/mappers/productMapper';

export interface IProductService {
  getByName(
    name: string,
    page: number,
    limit: number,
  ): Promise<ProductSearchResponseDTO>;
  getProductById(id: number): Promise<ProductResponseDTO>;
  createProduct(product: ProductRequestDTO): Promise<ProductResponseDTO>;
  updateProduct(
    id: number,
    product: ProductRequestDTO,
  ): Promise<ProductResponseDTO>;
  deleteProduct(id: number): Promise<ProductResponseDTO>;
  getProductsByCategoryId(
    categoryId: number,
    page: number,
    limit: number,
  ): Promise<ProductSearchResponseDTO>;
}

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
    const productEntity = await this._productMapper.requestDTOToEntity(product);
    return await this._productRepository.create(productEntity);
  }

  async updateProduct(
    id: number,
    product: ProductRequestDTO,
  ): Promise<ProductResponseDTO> {
    const productEntity = await this._productMapper.requestDTOToEntity(product);
    return this._productRepository.update(id, productEntity);
  }

  async deleteProduct(id: number): Promise<ProductResponseDTO> {
    return this._productRepository.delete(id);
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
