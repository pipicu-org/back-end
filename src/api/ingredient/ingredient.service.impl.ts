import { IngredientRequestDTO } from '../models/DTO/request/ingredientRequestDTO';
import { IngredientResponseDTO } from '../models/DTO/response/ingredientResponseDTO';
import { IngredientSearchResponseDTO } from '../models/DTO/response/ingredientSearchResponseDTO';
import { IngredientMapper } from '../models/mappers/ingredientMapper';
import { IIngredientRepository } from './ingredient.repository';
import { IIngredientService } from './ingredient.service';
import logger from '../../config/logger';
import { Unit } from '../models/entity';
import * as XLSX from 'xlsx';
import { DataSource } from 'typeorm';
import { Ingredient } from '../models/entity/ingredient';

export class IngredientService implements IIngredientService {
  constructor(
    private readonly _repository: IIngredientRepository,
    private readonly _ingredientMapper: IngredientMapper,
    private readonly _dataSource: DataSource,
  ) {}

  async createIngredient(
    requestDTO: IngredientRequestDTO,
  ): Promise<IngredientResponseDTO | void> {
    try {
      const ingredient = this._ingredientMapper.requestDTOToEntity(requestDTO);
      const createdIngredient = await this._repository.create(ingredient);
      return createdIngredient;
    } catch (error: any) {
      logger.error('Error creating ingredient', {
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async getIngredientById(id: number): Promise<IngredientResponseDTO | void> {
    try {
      const ingredient = await this._repository.findById(id);
      return ingredient;
    } catch (error: any) {
      logger.error('Error fetching ingredient by ID', {
        id,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async searchIngredients(
    search: string,
    page: number,
    limit: number,
  ): Promise<IngredientSearchResponseDTO | void> {
    try {
      return await this._repository.searchIngredient(search, page, limit);
    } catch (error: any) {
      logger.error('Error searching ingredients', {
        search,
        page,
        limit,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async updateIngredient(
    id: number,
    requestDTO: IngredientRequestDTO,
  ): Promise<IngredientResponseDTO | void> {
    try {
      const updatedIngredient =
        this._ingredientMapper.requestDTOToEntity(requestDTO);
      const ingredient = await this._repository.update(id, updatedIngredient);
      return ingredient;
    } catch (error: any) {
      logger.error('Error updating ingredient', {
        id,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async deleteIngredient(id: number): Promise<IngredientResponseDTO | void> {
    try {
      const ingredient = await this._repository.findById(id);
      await this._repository.delete(id);
      return ingredient;
    } catch (error: any) {
      logger.error('Error deleting ingredient', {
        id,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async getAllUnits(): Promise<Unit[] | void> {
    try {
      return await this._repository.getAllUnits();
    } catch (error: any) {
      logger.error('Error fetching all units', {
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async downloadTemplate(): Promise<Buffer> {
    const templateData = [
      {
        name: 'Ingrediente Ejemplo',
        unitId: 1,
        stock: 0,
        lossFactor: 1.0,
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Ingredients');

    const instructionsData = [
      { field: 'name', description: 'Nombre del ingrediente (required)' },
      { field: 'unitId', description: 'ID de la unidad de medida (required)' },
      { field: 'stock', description: 'Stock inicial (default: 0)' },
      { field: 'lossFactor', description: 'Factor de pérdida (default: 1.0)' },
    ];
    const instructionsSheet = XLSX.utils.json_to_sheet(instructionsData);
    XLSX.utils.book_append_sheet(workbook, instructionsSheet, 'Instructions');

    return Buffer.from(XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }));
  }

  async uploadFromExcel(file: Express.Multer.File): Promise<IngredientResponseDTO[]> {
    try {
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet) as any[];

      if (!data || data.length === 0) {
        throw new Error('El archivo Excel está vacío');
      }

      const createdIngredients: IngredientResponseDTO[] = [];
      const queryRunner = this._dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        for (const row of data) {
          if (!row.name || !row.unitId) {
            throw new Error('Faltan datos requeridos (name, unitId)');
          }

          const ingredient = new Ingredient();
          ingredient.name = row.name;
          ingredient.unitId = Number(row.unitId);
          ingredient.stock = row.stock || 0;
          ingredient.lossFactor = row.lossFactor || 1.0;

          const savedIngredient = await queryRunner.manager.save(ingredient);
          createdIngredients.push(this._ingredientMapper.toResponseDTO(savedIngredient));
        }

        await queryRunner.commitTransaction();
        return createdIngredients;
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
    } catch (error: any) {
      logger.error('Error uploading ingredients from Excel', {
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }
}
