import { recipeFactory } from '../../config';
import { Recipe } from '../models';
import { RecipeRequestDTO } from '../models/DTO/request/recipeRequestDTO';
import { RecipeResponseDTO } from '../models/DTO/response/recipeResponseDTO';
import { IRecipeRepository } from './recipe.repository';

export interface IRecipeService {
  findAll(): Promise<RecipeResponseDTO[]>;
  findById(id: number): Promise<RecipeResponseDTO | null>;
  create(recipeRequestDTO: RecipeRequestDTO): Promise<RecipeResponseDTO>;
  update(
    id: number,
    recipeRequestDTO: RecipeRequestDTO,
  ): Promise<RecipeResponseDTO | null>;
  delete(id: number): Promise<RecipeResponseDTO | null>;
}

export class RecipeService implements IRecipeService {
  constructor(private readonly recipeRepository: IRecipeRepository) {}

  async findAll(): Promise<RecipeResponseDTO[]> {
    const recipes = await this.recipeRepository.findAll();
    return recipes.map((recipe: Recipe) => new RecipeResponseDTO(recipe));
  }

  async findById(id: number): Promise<RecipeResponseDTO | null> {
    const recipe = await this.recipeRepository.findById(id);
    return recipe ? new RecipeResponseDTO(recipe) : null;
  }

  async create(recipeRequestDTO: RecipeRequestDTO): Promise<RecipeResponseDTO> {
    const recipe =
      await recipeFactory.createRecipeFromRequestDTO(recipeRequestDTO);
    const createdRecipe = await this.recipeRepository.create(recipe);
    return new RecipeResponseDTO(createdRecipe);
  }

  async update(
    id: number,
    recipeRequestDTO: RecipeRequestDTO,
  ): Promise<RecipeResponseDTO | null> {
    const recipeToUpdate =
      await recipeFactory.createRecipeFromRequestDTO(recipeRequestDTO);
    const updatedRecipe = await this.recipeRepository.update(
      id,
      recipeToUpdate,
    );
    return updatedRecipe ? new RecipeResponseDTO(updatedRecipe) : null;
  }

  async delete(id: number): Promise<RecipeResponseDTO | null> {
    const deletedRecipe = await this.recipeRepository.delete(id);
    return deletedRecipe ? new RecipeResponseDTO(deletedRecipe) : null;
  }
}
