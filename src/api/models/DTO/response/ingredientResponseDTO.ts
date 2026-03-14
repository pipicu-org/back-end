import { Ingredient } from '../../entity/ingredient';
import { UnitResponseDTO, IUnitResponseDTO } from './unitResponseDTO';

export interface IIngredientResponseDTO {
  id: number;
  name: string;
  unitId: number;
  unit?: IUnitResponseDTO;
  lossFactor: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

export class IngredientResponseDTO implements IIngredientResponseDTO {
  id: number;
  name: string;
  unitId: number;
  unit?: UnitResponseDTO;
  lossFactor: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(ingredient: Ingredient) {
    this.id = ingredient.id;
    this.name = ingredient.name;
    this.unitId = ingredient.unitId;
    this.lossFactor = ingredient.lossFactor;
    this.stock = ingredient.stock;
    this.createdAt = ingredient.createdAt;
    this.updatedAt = ingredient.updatedAt;
    
    // Include unit information if available
    if (ingredient.unit) {
      this.unit = new UnitResponseDTO(ingredient.unit);
    }
  }
}
