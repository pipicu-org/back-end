import { Purchase } from '../entity/purchase';
import { PurchaseResponseDTO } from '../DTO/response/purchaseResponseDTO';

export class PurchaseMapper {
  toResponseDTO(purchase: Purchase): PurchaseResponseDTO {
    return new PurchaseResponseDTO(purchase);
  }
}