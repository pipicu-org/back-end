import { Purchase } from '../../entity/purchase';

export interface IPurchaseResponseDTO {
  id: number;
  provider: {
    id: number;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
  purchaseItems: IPurchaseItemResponseDTO[];
}

export interface IPurchaseItemResponseDTO {
  id: number;
  purchaseId: number;
  ingredient: {
    id: number;
    name: string;
  };
  cost: number;
  quantity: number;
  unitId: number;
  unitQuantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export class PurchaseResponseDTO implements IPurchaseResponseDTO {
  id: number;
  provider: {
    id: number;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
  purchaseItems: IPurchaseItemResponseDTO[];

  constructor(purchase: Purchase) {
    this.id = purchase.id;
    this.provider = {
      id: purchase.provider.id,
      name: purchase.provider.name,
    };
    this.createdAt = purchase.createdAt;
    this.updatedAt = purchase.updatedAt;
    this.purchaseItems = purchase.purchaseItems.map((item) => ({
      id: item.id,
      purchaseId: item.purchaseId,
      ingredient: {
        id: item.ingredient.id,
        name: item.ingredient.name,
      },
      cost: item.cost,
      quantity: item.quantity,
      unitId: item.unitId,
      unitQuantity: item.unitQuantity,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));
  }
}
