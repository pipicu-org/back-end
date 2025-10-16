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

export interface IProductResponseEntityMapper {
  responseDTOToEntity(dto: ProductResponseDTO): Promise<Product>;
}

export class ProductMapper
  implements
    IProductEntityMapper,
    IProductResponseMapper,
    IProductSearchMapper,
    IProductResponseEntityMapper
{
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
    product.preTaxPrice = requestDTO.preTaxPrice;
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
      recipeIngredient.unitId = ingredientEntity.unitId;
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

  public async responseDTOToEntity(dto: ProductResponseDTO): Promise<Product> {
    if (!dto) {
      throw new HttpError(400, 'Invalid input: ProductResponseDTO is required');
    }

    const product = new Product();
    product.id = dto.id;
    product.name = dto.name;
    product.preTaxPrice = dto.preTaxPrice;
    product.price = dto.price;
    product.recipeId = dto.recipeId;
    product.categoryId = dto.categoryId;
    product.createdAt = new Date(dto.createdAt);
    product.updatedAt = new Date(dto.updatedAt);

    // Map category
    if (dto.category) {
      const category = new Category();
      category.id = dto.category.id;
      category.name = dto.category.name;
      product.category = category;
    }

    // Map recipe if present
    if (dto.recipe) {
      const recipe = new Recipe();
      recipe.id = dto.recipe.id;
      recipe.cost = dto.recipe.cost || 0;

      // Map ingredients
      if (dto.recipe.ingredients && Array.isArray(dto.recipe.ingredients)) {
        const ingredients = await this._ingredientRepository.find();
        recipe.recipeIngredient = dto.recipe.ingredients.map((ing) => {
          const ingredientEntity = ingredients.find(
            (i) => i.id === ing.ingredient.id,
          );
          if (!ingredientEntity) {
            throw new HttpError(
              404,
              `Ingredient with id ${ing.ingredient.id} not found`,
            );
          }
          const recipeIngredient = new RecipeIngredient();
          recipeIngredient.id = ing.id;
          recipeIngredient.quantity = ing.quantity;
          recipeIngredient.ingredient = ingredientEntity;
          recipeIngredient.recipe = recipe;
          recipeIngredient.unitId = ingredientEntity.unitId;
          return recipeIngredient;
        });
      }

      recipe.product = product;
      product.recipe = recipe;
    }

    return product;
  }
}
