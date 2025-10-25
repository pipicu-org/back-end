import { ProductRequestDTO } from '../models/DTO/request/productRequestDTO';
import { CustomProductResponsePaginatedDTO } from '../models/DTO/response/customProductResponsePaginatedDTO';
import { ProductResponseDTO } from '../models/DTO/response/productResponseDTO';
import { ProductSearchResponseDTO } from '../models/DTO/response/productSearchResponseDTO';

export interface IProductService {
  getByName(
    name: string,
    page: number,
    limit: number,
  ): Promise<ProductSearchResponseDTO>;
  getProductById(
    id: number,
  ): Promise<ProductResponseDTO>;
  createProduct(product: ProductRequestDTO): Promise<ProductResponseDTO>;
  updateProduct(id: number, product: ProductRequestDTO): Promise<ProductResponseDTO>;
  deleteProduct(id: number): Promise<ProductResponseDTO>;
  getProductsByCategoryId(
    categoryId: number,
    page: number,
    limit: number,
  ): Promise<ProductSearchResponseDTO>;
  getAllCustomProducts(
    page: number,
    limit: number,
  ): Promise<CustomProductResponsePaginatedDTO>;
}
