import { IngredientRequestDTO } from '../DTO/request/ingredientRequestDTO';
import { IngredientResponseDTO } from '../DTO/response/ingredientResponseDTO';
import { Ingredient } from '../entity';

export class IngredientMapper {
  public toResponseDTO(ingredient: Ingredient): IngredientResponseDTO {
    return new IngredientResponseDTO(ingredient);
  }

  public requestDTOToEntity(requestDTO: IngredientRequestDTO): Ingredient {
    const ingredient = new Ingredient();
    ingredient.name = requestDTO.name;
    ingredient.price = requestDTO.price;
    return ingredient;
  }
}
