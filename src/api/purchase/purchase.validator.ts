import { Unit } from '../models/entity/unit';
import { IngredientSearchResponseDTO } from '../models/DTO/response/ingredientSearchResponseDTO';
import { HttpError } from '../../errors/httpError';
import { IngredientMapper } from '../models/mappers/ingredientMapper';
import { Ingredient } from '../models/entity';

// Interface Segregation: Separate validation concerns
export interface IPurchaseValidator {
  validateUnit(unitId: number, units: Unit[]): Unit;
  validateIngredient(
    ingredientId: number,
    ingredients: IngredientSearchResponseDTO,
  ): Ingredient;
}

export class PurchaseValidator implements IPurchaseValidator {
  constructor(private readonly _ingredientMapper: IngredientMapper) {
    this._ingredientMapper = _ingredientMapper;
  }
  // Single Responsibility: Only handles validation logic
  validateUnit(unitId: number, units: Unit[]): Unit {
    const unit = units.find((u) => u.id === unitId);
    if (!unit) {
      throw new HttpError(400, `Unit with id ${unitId} not found`);
    }
    return unit;
  }

  validateIngredient(
    ingredientId: number,
    ingredients: IngredientSearchResponseDTO,
  ): Ingredient {
    const ingredient = ingredients.data.find((i) => i.id === ingredientId);
    if (!ingredient) {
      throw new HttpError(400, `Ingredient with id ${ingredientId} not found`);
    }
    return this._ingredientMapper.toEntity(ingredient);
  }
}
