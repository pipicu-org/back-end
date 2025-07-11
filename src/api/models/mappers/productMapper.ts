import { ICategoryRepository } from '../../category/category.repository';
import { ProductRequestDTO } from '../DTO/request/productRequestDTO';
import { ProductResponseDTO } from '../DTO/response/productResponseDTO';
import { ProductSearchResponseDTO } from '../DTO/response/productSearchResponseDTO';
import { Ingredient, Product } from '../entity';

export class ProductMapper {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  public searchToResponseDTO(
    findAndCount: [Product[], number],
    search: string,
    page: number,
    limit: number,
  ): ProductSearchResponseDTO {
    return new ProductSearchResponseDTO(findAndCount, search, page, limit);
  }

  public toResponseDTO(product: Product): ProductResponseDTO {
    return new ProductResponseDTO(product);
  }

  public async requestDTOToEntity(
    requestDTO: ProductRequestDTO,
  ): Promise<Product> {
    const product = new Product();
    product.name = requestDTO.name;
    product.price = requestDTO.price;
    const category = await this.categoryRepository.findByName(
      requestDTO.category,
    );
    if (!category) {
      throw new Error(`Category with name ${requestDTO.category} not found`);
    }
    product.category = category;
    product.recipe.ingredients = requestDTO.ingredients.map((ingredient) => {
      const ingredientEntity = new Ingredient();
      ingredientEntity.name = ingredient.name;
      ingredientEntity.quantity = ingredient.quantity;
      return ingredientEntity;
    });
    return product;
  }
}
