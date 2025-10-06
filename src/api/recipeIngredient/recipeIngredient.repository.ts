import { Repository } from 'typeorm';
import { RecipeIngredientResponseDTO } from '../models/DTO/response/recipeIngredientResponseDTO';
import { RecipeIngredient } from '../models/entity';
import { HttpError } from '../../errors/httpError';

export interface IRecipeIngredientRepository {
  getKitchenBoard(
    page: number,
    limit: number,
  ): Promise<RecipeIngredientResponseDTO>;
}

export class RecipeIngredientRepository
  implements IRecipeIngredientRepository
{
  constructor(
    private readonly _dbRecipeIngredientRepository: Repository<RecipeIngredient>,
  ) {}

  async getKitchenBoard(
    page: number,
    limit: number,
  ): Promise<RecipeIngredientResponseDTO> {
    try {
      const countAndResults = await this._dbRecipeIngredientRepository.manager
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
              .innerJoin('RecipeIngredient', 'ri', 'ri."recipeId" = r.id')
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

      return new RecipeIngredientResponseDTO(
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
