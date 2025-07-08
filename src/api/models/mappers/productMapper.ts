import { ICategoryRepository } from '../../category/category.repository';
import { IProductRequestDTO } from '../DTO/request/productRequestDTO';
import { Product } from '../product';

export class ProductMapper {
  constructor(
    private readonly recipeRepository: IRecipeRepository,
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  public async createProductFromRequestDTO(
    requestDTO: IProductRequestDTO,
  ): Promise<Product> {
    try {
      const product = new Product();
      const category = await this.categoryRepository.findByName(
        requestDTO.category,
      );
      if (!category) {
        throw new Error(`Category with ID: ${requestDTO.category} not found`);
      }
      product.category = category;
      product.name = requestDTO.name;
      product.price = requestDTO.price;
      const recipes = await Promise.all(
        requestDTO..map(async (recipeId) => {
          const recipe = await this.recipeRepository.findById(recipeId);
          if (!recipe) {
            throw new Error(`Recipe with ID: ${recipeId} not found`);
          }
          recipe.product = product;
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
