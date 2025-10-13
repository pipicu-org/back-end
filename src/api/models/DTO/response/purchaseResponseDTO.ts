import { Purchase } from '../../entity/purchase';

export interface IPurchaseResponseDTO {
  id: number;
  providerId: number;
  createdAt: Date;
  updatedAt: Date;
  purchaseItems: IPurchaseItemResponseDTO[];
}

export interface IPurchaseItemResponseDTO {
  id: number;
  purchaseId: number;
  ingredientId: number;
  cost: number;
  quantity: number;
  unitId: number;
  unitQuantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export class PurchaseResponseDTO implements IPurchaseResponseDTO {
  id: number;
  providerId: number;
  createdAt: Date;
  updatedAt: Date;
  purchaseItems: IPurchaseItemResponseDTO[];

  constructor(purchase: Purchase) {
    this.id = purchase.id;
    this.providerId = purchase.providerId;
    this.createdAt = purchase.createdAt;
    this.updatedAt = purchase.updatedAt;
    if (purchase.purchaseItems) {
      this.purchaseItems = purchase.purchaseItems.map((item) => ({
        id: item.id,
        purchaseId: item.purchaseId,
        ingredientId: item.ingredientId,
        cost: item.cost,
        quantity: item.quantity,
        unitId: item.unitId,
        unitQuantity: item.unitQuantity,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }));
    } else {
      this.purchaseItems = [];
    }
  }
}
