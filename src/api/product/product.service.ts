import { productFactory } from '../../config';
import { Product } from '../models/entity';
import { ProductRequestDTO } from '../models/DTO/request/productRequestDTO';
import { ProductResponseDTO } from '../models/DTO/response/productResponseDTO';
import { IProductRepository } from './product.repository';

export interface IProductService {
  getAllProducts(): Promise<ProductResponseDTO[]>;
  getProductById(id: number): Promise<ProductResponseDTO | null>;
  createProduct(product: ProductRequestDTO): Promise<ProductResponseDTO>;
  updateProduct(
    id: number,
    product: ProductRequestDTO,
  ): Promise<ProductResponseDTO | null>;
  deleteProduct(id: number): Promise<ProductResponseDTO | null>;
  getProductsByCategoryId(categoryId: number): Promise<ProductResponseDTO[]>;
}

export class ProductService implements IProductService {
  constructor(private readonly productRepository: IProductRepository) {}

  async getAllProducts(): Promise<ProductResponseDTO[]> {
    const products = await this.productRepository.findAll();
    return products.map((product: Product) => new ProductResponseDTO(product));
  }

  async getProductById(id: number): Promise<ProductResponseDTO | null> {
    const product = await this.productRepository.findById(id);
    return product ? new ProductResponseDTO(product) : null;
  }

  async createProduct(
    productRequestDTO: ProductRequestDTO,
  ): Promise<ProductResponseDTO> {
    const product =
      await productFactory.createProductFromRequestDTO(productRequestDTO);
    const createdProduct = await this.productRepository.create(product);
    return new ProductResponseDTO(createdProduct);
  }

  async updateProduct(
    id: number,
    productRequestDTO: ProductRequestDTO,
  ): Promise<ProductResponseDTO | null> {
    const productToUpdate =
      await productFactory.createProductFromRequestDTO(productRequestDTO);
    const updatedProduct = await this.productRepository.update(
      id,
      productToUpdate,
    );
    return updatedProduct ? new ProductResponseDTO(updatedProduct) : null;
  }

  async deleteProduct(id: number): Promise<ProductResponseDTO | null> {
    const deletedProduct = await this.productRepository.delete(id);
    return deletedProduct ? new ProductResponseDTO(deletedProduct) : null;
  }

  async getProductsByCategoryId(
    categoryId: number,
  ): Promise<ProductResponseDTO[]> {
    const products = await this.productRepository.getByCategoryId(categoryId);
    return products.map((product) => new ProductResponseDTO(product));
  }
}
