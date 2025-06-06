import { IngredientRequestDTO } from '../DTO/request/ingredientRequestDTO';
import { Ingredient } from '../ingredient';

export class IngredientFactory {
  public async createIngredientFromRequestDTO(
    requestDTO: IngredientRequestDTO,
  ): Promise<Ingredient> {
    try {
      const ingredient = new Ingredient();
      ingredient.name = requestDTO.name;
      ingredient.price = requestDTO.price;

      return ingredient;
    } catch (error) {
      console.error('Error creating ingredient from request DTO:', error);
      throw new Error('Failed to create ingredient');
    }
  }
}
