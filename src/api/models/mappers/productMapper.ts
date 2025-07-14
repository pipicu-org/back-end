import { Repository } from 'typeorm';
import { ProductRequestDTO } from '../DTO/request/productRequestDTO';
import { ProductResponseDTO } from '../DTO/response/productResponseDTO';
import { ProductSearchResponseDTO } from '../DTO/response/productSearchResponseDTO';
import { Category, Ingredient, Product, Recipe } from '../entity';
import { RecipeIngredients } from '../entity/recipeIngredients';

export class ProductMapper {
  constructor(
    private readonly categoryRepository: Repository<Category>,
    private readonly _ingredientRepository: Repository<Ingredient>,
  ) {}

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
    const recipeIngredients = await Promise.all(
      requestDTO.ingredients.map(async (ingredient) => {
        const ingredientEntity = await this._ingredientRepository.findOneBy({
          name: ingredient.name,
        });
        if (!ingredientEntity) {
          throw new Error(`Ingredient with name ${ingredient.name} not found`);
        }
        const recipeIngredient = new RecipeIngredients();
        recipeIngredient.quantity = ingredient.quantity;
        recipeIngredient.ingredient = ingredientEntity;
        recipeIngredient.recipe = recipe;
        return recipeIngredient;
      }),
    );
    recipe.totalPrice = recipeIngredients.reduce(
      (total, ri) => total + ri.ingredient.price * ri.quantity,
      0,
    );
    recipe.recipeIngredients = recipeIngredients;
    recipe.product = product;
    product.recipe = recipe;
    return product;
  }
}
