import {
  CreatePurchaseDto,
  UpdatePurchaseDto,
} from '../models/DTO/request/purchaseRequestDTO';
import { PurchaseResponseDTO } from '../models/DTO/response/purchaseResponseDTO';
import { PurchasePageResponseDTO } from '../models/DTO/response/purchasePageResponseDTO';
import { PurchaseItem } from '../models/entity';

export interface IPurchaseService {
  createPurchase(purchase: CreatePurchaseDto): Promise<PurchaseResponseDTO>;
  getAllPurchases(
    page?: number,
    size?: number,
    sort?: string,
  ): Promise<PurchasePageResponseDTO>;
  getPurchaseById(id: number): Promise<PurchaseResponseDTO | void>;
  updatePurchase(
    id: number,
    purchase: UpdatePurchaseDto,
  ): Promise<PurchaseResponseDTO | void>;
  findItemsByPurchaseId(purchaseId: number): Promise<PurchaseItem[]>;
  deletePurchase(id: number): Promise<PurchaseResponseDTO | void>;
}
