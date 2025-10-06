import { IngredientRequestDTO } from '../DTO/request/ingredientRequestDTO';
import { IngredientResponseDTO } from '../DTO/response/ingredientResponseDTO';
import { IngredientSearchResponseDTO } from '../DTO/response/ingredientSearchResponseDTO';
import { Ingredient } from '../entity';

export interface IIngredientEntityMapper {
  requestDTOToEntity(requestDTO: IngredientRequestDTO): Ingredient;
  toEntity(ingredient: IngredientResponseDTO): Ingredient;
}

export interface IIngredientResponseMapper {
  toResponseDTO(ingredient: Ingredient): IngredientResponseDTO;
}

export interface IIngredientSearchMapper {
  createSearchToIngredientSearchDTO(
    resultsAndCount: [Ingredient[], number],
    search: string,
    page: number,
    limit: number,
  ): IngredientSearchResponseDTO;
}

export class IngredientMapper implements IIngredientEntityMapper, IIngredientResponseMapper, IIngredientSearchMapper {
  public toResponseDTO(ingredient: Ingredient): IngredientResponseDTO {
    return new IngredientResponseDTO(ingredient);
  }

  public requestDTOToEntity(requestDTO: IngredientRequestDTO): Ingredient {
    const ingredient = new Ingredient();
    ingredient.name = requestDTO.name;
    ingredient.unitId = requestDTO.unitId;
    ingredient.lossFactor = requestDTO.lossFactor;
    // ingredient.price = requestDTO.price;
    return ingredient;
  }

  public toEntity(ingredient: IngredientResponseDTO): Ingredient {
    const entity = new Ingredient();
    entity.id = ingredient.id;
    entity.name = ingredient.name;
    // entity.price = ingredient.price;
    return entity;
  }

  public createSearchToIngredientSearchDTO(
    resultsAndCount: [Ingredient[], number],
    search: string,
    page: number,
    limit: number,
  ): IngredientSearchResponseDTO {
    return new IngredientSearchResponseDTO(
      search,
      resultsAndCount[1],
      page,
      limit,
      resultsAndCount[0].map((ingredient) => ({
        id: ingredient.id.toString(),
        name: ingredient.name,
        // price: ingredient.price,
      })),
    );
  }
}
