import { Repository } from 'typeorm';
import { ProductRequestDTO } from '../DTO/request/productRequestDTO';
import { ProductResponseDTO } from '../DTO/response/productResponseDTO';
import { ProductSearchResponseDTO } from '../DTO/response/productSearchResponseDTO';
import { Category, Ingredient, Product, Recipe } from '../entity';

export class ProductMapper {
  constructor(private readonly categoryRepository: Repository<Category>) {}

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
    const category = await this.categoryRepository.findOneBy({
      name: requestDTO.category,
    });
    if (!category) {
      throw new Error(`Category with name ${requestDTO.category} not found`);
    }
    if (!Array.isArray(requestDTO.ingredients)) {
      throw new Error('ingredients must be an array');
    }
    product.category = category;
    const recipe = new Recipe();
    recipe.ingredients = requestDTO.ingredients.map((ingredient) => {
      const ingredientEntity = new Ingredient();
      ingredientEntity.name = ingredient.name;
      ingredientEntity.quantity = ingredient.quantity;
      ingredientEntity.price = ingredient.price;
      return ingredientEntity;
    });
    recipe.totalPrice = requestDTO.ingredients.reduce(
      (total, ingredient) => total + ingredient.quantity * ingredient.price,
      0,
    );
    product.recipe = recipe;
    return product;
  }
}
