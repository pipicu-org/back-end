import { Repository } from 'typeorm';
import { RecipeIngredientsResponseDTO } from '../models/DTO/response/recipeIngredientsResponseDTO';
import { RecipeIngredients } from '../models/entity';
import { HttpError } from '../../errors/httpError';

export interface IRecipeIngredientsRepository {
  getKitchenBoard(
    page: number,
    limit: number,
  ): Promise<RecipeIngredientsResponseDTO>;
}

export class RecipeIngredientsRepository
  implements IRecipeIngredientsRepository
{
  constructor(
    private readonly _dbRecipeIngredientsRepository: Repository<RecipeIngredients>,
  ) {}

  async getKitchenBoard(
    page: number,
    limit: number,
  ): Promise<RecipeIngredientsResponseDTO> {
    try {
      const countAndResults = await this._dbRecipeIngredientsRepository.manager
        .createQueryBuilder()
        .select('p.id', 'id')
        .addSelect('p.name', 'name')
        .addSelect('ipt."orderId"', 'orderId')
        .addSelect('ipt."ingredientIds"', 'ingredientIds')
        .addSelect('ipt."ingredientNames"', 'ingredientNames')
        .from('Product', 'p')
        .innerJoin(
          (qb) =>
            qb
              .select('l."orderId"', 'orderId')
              .addSelect('p.id', 'id')
              .addSelect('p.name', 'name')
              .addSelect('array_agg(i.id)', 'ingredientIds')
              .addSelect('array_agg(i.name)', 'ingredientNames')
              .from('Line', 'l')
              .innerJoin('Order', 'o', 'o.id = l."orderId"')
              .innerJoin('Product', 'p', 'p.id = l."productId"')
              .innerJoin('Recipe', 'r', 'r.id = p."recipeId"')
              .innerJoin('RecipeIngredients', 'ri', 'ri."recipeId" = r.id')
              .innerJoin('Ingredient', 'i', 'i.id = ri."ingredientId"')
              .innerJoin('State', 's', 's.id = o."stateId"')
              .where('s.id = 1')
              .orWhere('s.id = 2')
              .groupBy('l."orderId", p.id, p.name, r.id'),
          'ipt',
          'ipt.id = p.id',
        )
        .skip((page - 1) * limit)
        .take(limit)
        .getRawMany();

      return new RecipeIngredientsResponseDTO(
        page,
        limit,
        countAndResults.length,
        countAndResults.map((item) => ({
          product: { id: item.id, name: item.name },
          orderId: item.orderId,
          ingredientsIds: item.ingredientIds,
          ingredientsNames: item.ingredientNames,
        })),
      );
    } catch (error: any) {
      console.error('Error fetching kitchen board:', error);
      throw new HttpError(
        error.status || 500,
        error.message || 'Internal Server Error',
      );
    }
  }
}
