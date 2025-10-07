import { CreatePurchaseDto, UpdatePurchaseDto } from '../models/DTO/request/purchaseRequestDTO';
import { PurchaseResponseDTO } from '../models/DTO/response/purchaseResponseDTO';

export interface IPurchaseService {
  createPurchase(purchase: CreatePurchaseDto): Promise<PurchaseResponseDTO>;
  getAllPurchases(): Promise<PurchaseResponseDTO[]>;
  getPurchaseById(id: number): Promise<PurchaseResponseDTO | void>;
  updatePurchase(id: number, purchase: UpdatePurchaseDto): Promise<PurchaseResponseDTO | void>;
  deletePurchase(id: number): Promise<PurchaseResponseDTO | void>;
}