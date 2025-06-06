import { ICategoryRepository } from '../../category/category.repository';
import { IRecipeRepository } from '../../recipe/recipe.repository';
import { IProductRequestDTO } from '../DTO/request/productRequestDTO';
import { Product } from '../product';

export class ProductFactory {
  constructor(
    private readonly recipeRepository: IRecipeRepository,
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  public async createProductFromRequestDTO(
    requestDTO: IProductRequestDTO,
  ): Promise<Product> {
    try {
      const product = new Product();
      const category = await this.categoryRepository.findById(
        requestDTO.categoryId,
      );
      if (!category) {
        throw new Error(`Category with ID: ${requestDTO.categoryId} not found`);
      }
      product.category = category;
      product.name = requestDTO.name;
      product.price = requestDTO.price;
      const recipes = await Promise.all(
        requestDTO.recipesId.map(async (recipeId) => {
          const recipe = await this.recipeRepository.findById(recipeId);
          if (!recipe) {
            throw new Error(`Recipe with ID: ${recipeId} not found`);
          }
          recipe.product = product; // Set the product reference in the recipe
          return recipe;
        }),
      );
      product.recipes = recipes;
      return product;
    } catch (error) {
      console.error('Error creating product from request DTO:', error);
      throw new Error('Failed to create product');
    }
  }
}
