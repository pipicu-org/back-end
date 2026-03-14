import {
  CreatePurchaseDto,
  UpdatePurchaseDto,
} from '../models/DTO/request/purchaseRequestDTO';
import { PurchaseResponseDTO } from '../models/DTO/response/purchaseResponseDTO';
import { PurchasePageResponseDTO } from '../models/DTO/response/purchasePageResponseDTO';
import { PurchaseItem } from '../models/entity';
import { IPurchaseRepository } from './purchase.repository';
import { IPurchaseService } from './purchase.service';
import { HttpError } from '../../errors/httpError';
import logger from '../../config/logger';
import {
  CreatePurchaseStrategy,
  UpdatePurchaseStrategy,
} from './purchase.strategy';
import * as XLSX from 'xlsx';
import { DataSource } from 'typeorm';
import { Purchase } from '../models/entity/purchase';
import { PurchaseItem as PurchaseItemEntity } from '../models/entity/purchaseItem';

export class PurchaseService implements IPurchaseService {
  constructor(
    private readonly _purchaseRepository: IPurchaseRepository,
    private readonly _createStrategy: CreatePurchaseStrategy,
    private readonly _updateStrategy: UpdatePurchaseStrategy,
    private readonly _dataSource: DataSource,
  ) {}

  async findItemsByPurchaseId(purchaseId: number): Promise<PurchaseItem[]> {
    return await this._purchaseRepository.findItemsByPurchaseId(purchaseId);
  }

  async createPurchase(
    purchaseDto: CreatePurchaseDto,
  ): Promise<PurchaseResponseDTO> {
    try {
      // Strategy Pattern: Delegates to specific strategy for creation
      // Open-Closed: New strategies can be added without modifying this method
      return await this._createStrategy.execute(purchaseDto);
    } catch (error: any) {
      logger.error('Error creating purchase with items', {
        error: error.message,
        stack: error.stack,
      });
      throw new HttpError(500, 'Failed to create purchase');
    }
  }

  async getAllPurchases(
    page: number = 0,
    size: number = 10,
    sort: string = 'date_desc',
  ): Promise<PurchasePageResponseDTO> {
    // Validate parameters
    if (page < 0) {
      throw new HttpError(400, 'Page must be >= 0');
    }
    if (size < 1 || size > 100) {
      throw new HttpError(400, 'Size must be between 1 and 100');
    }

    // Parse sort parameter
    const [sortField, sortOrderStr] = sort.split('_');
    let sortOrder: 'ASC' | 'DESC' = 'DESC';
    if (sortOrderStr && sortOrderStr.toLowerCase() === 'asc') {
      sortOrder = 'ASC';
    }

    if (sortField !== 'date') {
      throw new HttpError(400, 'Sort field must be "date"');
    }

    return await this._purchaseRepository.findAllPaginated(
      page,
      size,
      sortField,
      sortOrder,
    );
  }

  async getPurchaseById(id: number): Promise<PurchaseResponseDTO | void> {
    return await this._purchaseRepository.findById(id);
  }

  async updatePurchase(
    id: number,
    purchaseDto: UpdatePurchaseDto,
  ): Promise<PurchaseResponseDTO | void> {
    try {
      // Strategy Pattern: Delegates to specific strategy for update
      // Open-Closed: New strategies can be added without modifying this method
      return await this._updateStrategy.execute(purchaseDto, id);
    } catch (error: any) {
      logger.error('Error updating purchase', {
        id,
        error: error.message,
        stack: error.stack,
      });
      throw new HttpError(500, 'Failed to update purchase');
    }
  }

  async deletePurchase(id: number): Promise<PurchaseResponseDTO | void> {
    return await this._purchaseRepository.delete(id);
  }

  async downloadTemplate(): Promise<Buffer> {
    // Create template with sample data structure
    const templateData = [
      {
        providerId: 1,
        ingredientId: 1,
        cost: 10.50,
        quantity: 100,
        unitId: 1,
        unitQuantity: 1,
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Purchases');

    // Add instructions sheet
    const instructionsData = [
      { field: 'providerId', description: 'ID del proveedor (required)' },
      { field: 'ingredientId', description: 'ID del ingrediente (required)' },
      { field: 'cost', description: 'Costo del ingrediente (required)' },
      { field: 'quantity', description: 'Cantidad comprada (required)' },
      { field: 'unitId', description: 'ID de la unidad (required)' },
      { field: 'unitQuantity', description: 'Cantidad por unidad (required)' },
    ];
    const instructionsSheet = XLSX.utils.json_to_sheet(instructionsData);
    XLSX.utils.book_append_sheet(workbook, instructionsSheet, 'Instructions');

    return Buffer.from(XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }));
  }

  async uploadFromExcel(file: Express.Multer.File): Promise<PurchaseResponseDTO[]> {
    try {
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet) as any[];

      if (!data || data.length === 0) {
        throw new HttpError(400, 'El archivo Excel está vacío');
      }

      // Group items by providerId to create one purchase per provider
      const purchasesByProvider = new Map<number, any[]>();
      
      for (const row of data) {
        const providerId = row.providerId;
        if (!providerId) {
          throw new HttpError(400, 'Falta providerId en una fila');
        }

        if (!purchasesByProvider.has(providerId)) {
          purchasesByProvider.set(providerId, []);
        }

        purchasesByProvider.get(providerId)!.push({
          ingredientId: row.ingredientId,
          cost: parseFloat(row.cost),
          quantity: parseFloat(row.quantity),
          unitId: row.unitId,
          unitQuantity: parseFloat(row.unitQuantity),
        });
      }

      // Create a purchase for each provider
      const createdPurchases: PurchaseResponseDTO[] = [];
      const queryRunner = this._dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        for (const [providerId, items] of purchasesByProvider) {
          const purchaseDto: CreatePurchaseDto = {
            providerId: Number(providerId),
            purchaseItems: items.map(item => ({
              ingredientId: Number(item.ingredientId),
              cost: item.cost,
              quantity: item.quantity,
              unitId: Number(item.unitId),
              unitQuantity: item.unitQuantity,
            })),
          };

          const purchase = await this._createStrategy.execute(purchaseDto);
          createdPurchases.push(purchase);
        }

        await queryRunner.commitTransaction();
        return createdPurchases;
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
    } catch (error: any) {
      logger.error('Error uploading purchases from Excel', {
        error: error.message,
        stack: error.stack,
      });
      throw new HttpError(500, 'Error al procesar el archivo Excel');
    }
  }
}
