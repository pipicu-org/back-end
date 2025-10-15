import { Purchase } from '../entity/purchase';
import { PurchaseResponseDTO } from '../DTO/response/purchaseResponseDTO';
import { PurchasePageResponseDTO } from '../DTO/response/purchasePageResponseDTO';
import { PurchaseItem } from '../entity';
import { CreatePurchaseDto } from '../DTO/request/purchaseRequestDTO';

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

  responseDTOToEntity(dto: PurchaseResponseDTO): Purchase {
    if (!dto.purchaseItems || dto.purchaseItems.length === 0) {
      throw new Error('Purchase must have at least one purchase item');
    }
    const purchase = new Purchase();
    purchase.id = dto.id;
    purchase.providerId = dto.providerId;
    purchase.createdAt = dto.createdAt;
    purchase.updatedAt = dto.updatedAt;
    purchase.purchaseItems = dto.purchaseItems.map((itemDto) => {
      const item = new PurchaseItem();
      item.id = itemDto.id;
      item.ingredientId = itemDto.ingredientId;
      item.cost = itemDto.cost;
      item.quantity = itemDto.quantity;
      item.unitId = itemDto.unitId;
      item.unitQuantity = itemDto.unitQuantity;
      item.createdAt = itemDto.createdAt;
      item.updatedAt = itemDto.updatedAt;
      return item;
    });
    return purchase;
  }

  createDTOToEntity(dto: CreatePurchaseDto): Purchase {
    if (!dto.purchaseItems || dto.purchaseItems.length === 0) {
      throw new Error('Purchase must have at least one purchase item');
    }
    const purchase = new Purchase();
    purchase.providerId = dto.providerId;
    purchase.purchaseItems = dto.purchaseItems.map((itemDto) => {
      const item = new PurchaseItem();
      item.ingredientId = itemDto.ingredientId;
      item.cost = itemDto.cost;
      item.quantity = itemDto.quantity;
      item.unitId = itemDto.unitId;
      item.unitQuantity = itemDto.unitQuantity;
      return item;
    });
    return purchase;
  }
}
