import { Purchase } from '../entity/purchase';
import { PurchaseResponseDTO } from '../DTO/response/purchaseResponseDTO';
import { PurchasePageResponseDTO } from '../DTO/response/purchasePageResponseDTO';

export class PurchaseMapper {
  toResponseDTO(purchase: Purchase): PurchaseResponseDTO {
    return new PurchaseResponseDTO(purchase);
  }

  toPaginationDTO(
    resultsAndCount: [Purchase[], number],
    page: number,
    size: number,
  ): PurchasePageResponseDTO {
    return new PurchasePageResponseDTO(
      resultsAndCount[0].map((purchase) => this.toResponseDTO(purchase)),
      resultsAndCount[1],
      page,
      size,
    );
  }
}
