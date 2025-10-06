import { Repository } from 'typeorm';
import { ProductRequestDTO } from '../DTO/request/productRequestDTO';
import { ProductResponseDTO } from '../DTO/response/productResponseDTO';
import { ProductSearchResponseDTO } from '../DTO/response/productSearchResponseDTO';
import { Category, Ingredient, Product, Recipe } from '../entity';
import { RecipeIngredient } from '../entity/recipeIngredient';
import { HttpError } from '../../../errors/httpError';

export interface IProductEntityMapper {
  requestDTOToEntity(requestDTO: ProductRequestDTO): Promise<Product>;
}

export interface IProductResponseMapper {
  toResponseDTO(product: Product): ProductResponseDTO;
}

export interface IProductSearchMapper {
  searchToResponseDTO(
    findAndCount: [Product[], number],
    search: string,
    page: number,
    limit: number,
  ): ProductSearchResponseDTO;
}

export class ProductMapper implements IProductEntityMapper, IProductResponseMapper, IProductSearchMapper {
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
      id: requestDTO.category,
    });
    if (!category) {
      throw new HttpError(
        404,
        `Category with id ${requestDTO.category} not found`,
      );
    }
    if (!Array.isArray(requestDTO.ingredients)) {
      throw new HttpError(400, 'ingredients must be an array');
    }
    product.category = category;
    const ingredients = await this._ingredientRepository.find();
    const recipeEntity = new Recipe();
    const recipeIngredient = requestDTO.ingredients.map((ingredient) => {
      const ingredientEntity = ingredients.find((i) => i.id === ingredient.id);
      if (!ingredientEntity) {
        throw new HttpError(
          404,
          `Ingredient with id ${ingredient.id} not found`,
        );
      }
      const recipeIngredient = new RecipeIngredient();
      recipeIngredient.quantity = ingredient.quantity;
      recipeIngredient.ingredient = ingredientEntity;
      recipeIngredient.recipe = recipeEntity;
      return recipeIngredient;
    });

    // TODO: La receta no tiene totalPrice
    // recipeEntity.totalPrice = 0;
    // for (const recipeIngredient of recipeIngredient) {
    //   recipeEntity.totalPrice +=
    //     recipeIngredient.ingredient.price * recipeIngredient.quantity;
    // }
    recipeEntity.recipeIngredient = recipeIngredient;
    recipeEntity.product = product;
    product.recipe = recipeEntity;
    return product;
  }
}
