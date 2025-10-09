import { PurchaseResponseDTO } from './purchaseResponseDTO';

export interface IPurchasePageResponseDTO {
  purchases: PurchaseResponseDTO[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export class PurchasePageResponseDTO implements IPurchasePageResponseDTO {
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasPrevious: boolean;
  hasNext: boolean;
  purchases: PurchaseResponseDTO[];

  constructor(
    purchases: PurchaseResponseDTO[],
    totalElements: number,
    currentPage: number,
    pageSize: number,
  ) {
    this.purchases = purchases;
    this.totalElements = totalElements;
    this.currentPage = currentPage;
    this.pageSize = pageSize;
    this.totalPages = Math.ceil(totalElements / pageSize);
    this.hasPrevious = currentPage > 0;
    this.hasNext = currentPage < this.totalPages - 1;
  }
}
