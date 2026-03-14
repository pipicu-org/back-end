import { ProviderRequestDTO } from '../models/DTO/request/providerRequestDTO';
import { ProviderResponseDTO } from '../models/DTO/response/providerResponseDTO';
import { ProviderSearchResponseDTO } from '../models/DTO/response/providerSearchResponseDTO';
import { ProviderMapper } from '../models/mappers/providerMapper';
import { IProviderRepository } from './provider.repository';
import { IProviderService } from './provider.service';
import logger from '../../config/logger';
import * as XLSX from 'xlsx';
import { DataSource } from 'typeorm';
import { Provider } from '../models/entity/provider';

export class ProviderService implements IProviderService {
  constructor(
    private readonly _repository: IProviderRepository,
    private readonly _providerMapper: ProviderMapper,
    private readonly _dataSource: DataSource,
  ) {}

  async createProvider(
    requestDTO: ProviderRequestDTO,
  ): Promise<ProviderResponseDTO | void> {
    try {
      const provider = this._providerMapper.requestDTOToEntity(requestDTO);
      const createdProvider = await this._repository.create(provider);
      return createdProvider;
    } catch (error: any) {
      logger.error('Error creating provider', { error: error.message, stack: error.stack });
      throw error;
    }
  }

  async getProviderById(id: number): Promise<ProviderResponseDTO | void> {
    try {
      const provider = await this._repository.findById(id);
      return provider;
    } catch (error: any) {
      logger.error('Error fetching provider by ID', { id, error: error.message, stack: error.stack });
      throw error;
    }
  }

  async searchProviders(
    search: string,
    page: number,
    limit: number,
    sort: string,
  ): Promise<ProviderSearchResponseDTO | void> {
    try {
      return await this._repository.searchProvider(search, page, limit, sort);
    } catch (error: any) {
      logger.error('Error searching providers', { search, page, limit, sort, error: error.message, stack: error.stack });
      throw error;
    }
  }

  async updateProvider(
    id: number,
    requestDTO: ProviderRequestDTO,
  ): Promise<ProviderResponseDTO | void> {
    try {
      const updatedProvider =
        this._providerMapper.requestDTOToEntity(requestDTO);
      const provider = await this._repository.update(id, updatedProvider);
      return provider;
    } catch (error: any) {
      logger.error('Error updating provider', { id, error: error.message, stack: error.stack });
      throw error;
    }
  }

  async deleteProvider(id: number): Promise<ProviderResponseDTO | void> {
    try {
      const provider = await this._repository.findById(id);
      await this._repository.delete(id);
      return provider;
    } catch (error: any) {
      logger.error('Error deleting provider', { id, error: error.message, stack: error.stack });
      throw error;
    }
  }

  async downloadTemplate(): Promise<Buffer> {
    const templateData = [
      {
        name: 'Proveedor Ejemplo',
        description: 'Descripción del proveedor',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Providers');

    const instructionsData = [
      { field: 'name', description: 'Nombre del proveedor (required)' },
      { field: 'description', description: 'Descripción del proveedor (required)' },
    ];
    const instructionsSheet = XLSX.utils.json_to_sheet(instructionsData);
    XLSX.utils.book_append_sheet(workbook, instructionsSheet, 'Instructions');

    return Buffer.from(XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }));
  }

  async uploadFromExcel(file: Express.Multer.File): Promise<ProviderResponseDTO[]> {
    try {
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet) as any[];

      if (!data || data.length === 0) {
        throw new Error('El archivo Excel está vacío');
      }

      const createdProviders: ProviderResponseDTO[] = [];
      const queryRunner = this._dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        for (const row of data) {
          if (!row.name || !row.description) {
            throw new Error('Faltan datos requeridos (name, description)');
          }

          const provider = new Provider();
          provider.name = row.name;
          provider.description = row.description;

          const savedProvider = await queryRunner.manager.save(provider);
          createdProviders.push(this._providerMapper.toResponseDTO(savedProvider));
        }

        await queryRunner.commitTransaction();
        return createdProviders;
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
    } catch (error: any) {
      logger.error('Error uploading providers from Excel', {
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }
}