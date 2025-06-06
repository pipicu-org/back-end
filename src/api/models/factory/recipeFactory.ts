import { IIngredientRepository } from '../../ingredient/ingredient.repository';
import { RecipeRequestDTO } from '../DTO/request/recipeRequestDTO';
import { Recipe } from '../recipe';

export class RecipeFactory {
  constructor(private readonly ingredientRepository: IIngredientRepository) {}
  public async createRecipeFromRequestDTO(
    requestDTO: RecipeRequestDTO,
  ): Promise<Recipe> {
    try {
      const recipe = new Recipe();
      const ingredient = await this.ingredientRepository.findById(
        requestDTO.ingredientId,
      );
      if (!ingredient) {
        throw new Error(
          `Ingredient with ID: ${requestDTO.ingredientId} not found`,
        );
      }
      recipe.ingredient = ingredient;
      recipe.quantity = requestDTO.quantity;
      recipe.totalPrice = ingredient.price * requestDTO.quantity;
      return recipe;
    } catch (error) {
      console.error('Error creating recipe from request DTO:', error);
      throw new Error('Failed to create recipe');
    }
  }
}
