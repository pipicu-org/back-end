export interface IProductService {
  getByName(
    name: string,
    page: number,
    limit: number,
  ): Promise<
    import('../models/DTO/response/productSearchResponseDTO').ProductSearchResponseDTO
  >;
  getProductById(
    id: number,
  ): Promise<
    import('../models/DTO/response/productResponseDTO').ProductResponseDTO
  >;
  createProduct(
    product: import('../models/DTO/request/productRequestDTO').ProductRequestDTO,
  ): Promise<
    import('../models/DTO/response/productResponseDTO').ProductResponseDTO
  >;
  updateProduct(
    id: number,
    product: import('../models/DTO/request/productRequestDTO').ProductRequestDTO,
  ): Promise<
    import('../models/DTO/response/productResponseDTO').ProductResponseDTO
  >;
  deleteProduct(
    id: number,
  ): Promise<
    import('../models/DTO/response/productResponseDTO').ProductResponseDTO
  >;
  getProductsByCategoryId(
    categoryId: number,
    page: number,
    limit: number,
  ): Promise<
    import('../models/DTO/response/productSearchResponseDTO').ProductSearchResponseDTO
  >;
  createCustomProduct(
    customProduct: import('../models/DTO/request/customProductRequestDTO').CustomProductRequestDTO,
  ): Promise<
    import('../models/DTO/response/productResponseDTO').ProductResponseDTO
  >;
  getCustomProductById(
    id: number,
  ): Promise<
    import('../models/DTO/response/productResponseDTO').ProductResponseDTO
  >;
  getAllCustomProducts(
    page: number,
    limit: number,
  ): Promise<
    import('../models/DTO/response/customProductResponsePaginatedDTO').CustomProductResponsePaginatedDTO
  >;
}
