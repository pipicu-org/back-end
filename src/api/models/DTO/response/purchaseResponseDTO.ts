import { Purchase } from '../../entity/purchase';
import { ProviderResponseDTO } from './providerResponseDTO';
import { UnitResponseDTO } from './unitResponseDTO';

export interface IProviderInfo {
  id: number;
  name: string;
}

export interface IIngredientInfo {
  id: number;
  name: string;
}

export interface IUnitInfo {
  id: number;
  name: string;
}

export interface IPurchaseItemIngredient {
  id: number;
  name: string;
}

export interface IPurchaseItemUnit {
  id: number;
  name: string;
}

export interface IPurchaseResponseDTO {
  id: number;
  providerId: number;
  provider?: IProviderInfo;
  createdAt: Date;
  updatedAt: Date;
  purchaseItems: IPurchaseItemResponseDTO[];
}

export interface IPurchaseItemResponseDTO {
  id: number;
  purchaseId: number;
  ingredientId: number;
  ingredient?: IPurchaseItemIngredient;
  cost: number;
  quantity: number;
  unitId: number;
  unit?: IPurchaseItemUnit;
  unitQuantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export class PurchaseResponseDTO implements IPurchaseResponseDTO {
  id: number;
  providerId: number;
  provider?: IProviderInfo;
  createdAt: Date;
  updatedAt: Date;
  purchaseItems: IPurchaseItemResponseDTO[];

  constructor(purchase: Purchase) {
    this.id = purchase.id;
    this.providerId = purchase.providerId;
    this.createdAt = purchase.createdAt;
    this.updatedAt = purchase.updatedAt;
    
    // Include provider information if available
    if (purchase.provider) {
      this.provider = {
        id: purchase.provider.id,
        name: purchase.provider.name,
      };
    }
    
    this.purchaseItems = purchase.purchaseItems.map((item) => ({
      id: item.id,
      purchaseId: item.purchaseId,
      ingredientId: item.ingredientId,
      cost: Number(item.cost),
      quantity: Number(item.quantity),
      unitId: item.unitId,
      unitQuantity: Number(item.unitQuantity),
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      // Include ingredient information if available
      ingredient: item.ingredient ? {
        id: item.ingredient.id,
        name: item.ingredient.name,
      } : undefined,
      // Include unit information if available
      unit: item.unit ? {
        id: item.unit.id,
        name: item.unit.name,
      } : undefined,
    }));
  }
}
