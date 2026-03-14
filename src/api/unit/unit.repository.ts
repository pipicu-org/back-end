import { Repository } from 'typeorm';
import { Unit } from '../models/entity';
import { UnitResponseDTO } from '../models/DTO/response/unitResponseDTO';
import { UnitMapper } from '../models/mappers/unitMapper';
import { HttpError } from '../../errors/httpError';
import logger from '../../config/logger';

export interface IUnitRepository {
  findAll(page?: number, limit?: number, search?: string, sortBy?: string, sortOrder?: 'ASC' | 'DESC'): Promise<{ data: UnitResponseDTO[]; total: number; page: number; limit: number }>;
  findById(id: number): Promise<UnitResponseDTO | void>;
  create(unit: Unit): Promise<UnitResponseDTO>;
  update(id: number, unit: Unit): Promise<UnitResponseDTO | void>;
  delete(id: number): Promise<UnitResponseDTO | void>;
}

export class UnitRepository implements IUnitRepository {
  constructor(
    private readonly _dbUnitRepository: Repository<Unit>,
    private readonly _unitMapper: UnitMapper,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    sortBy: string = 'name',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): Promise<{ data: UnitResponseDTO[]; total: number; page: number; limit: number }> {
    try {
      let queryBuilder = this._dbUnitRepository.createQueryBuilder('unit');

      if (search) {
        queryBuilder = queryBuilder.where('unit.name ILIKE :search', { search: `%${search}%` });
      }

      // Apply sorting
      const validSortFields: Record<string, string> = {
        id: 'unit.id',
        name: 'unit.name',
        factor: 'unit.factor',
        createdAt: 'unit.createdAt',
      };
      const sortField = validSortFields[sortBy] || 'unit.name';
      queryBuilder = queryBuilder.orderBy(sortField, sortOrder);

      const [units, total] = await queryBuilder
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      return {
        data: units.map(unit => this._unitMapper.toResponseDTO(unit)),
        total,
        page,
        limit,
      };
    } catch (error: any) {
      logger.error('Error fetching all units', { error: error.message, stack: error.stack });
      throw new HttpError(500, 'Failed to fetch units');
    }
  }

  async findById(id: number): Promise<UnitResponseDTO | void> {
    try {
      const unit = await this._dbUnitRepository.findOneBy({ id });
      if (unit) {
        return this._unitMapper.toResponseDTO(unit);
      } else {
        throw new HttpError(404, `Unit with id ${id} not found`);
      }
    } catch (error: any) {
      logger.error('Error fetching unit by ID', { id, error: error.message, stack: error.stack });
      throw new HttpError(
        error.status || 500,
        error.message || 'Failed to fetch unit',
      );
    }
  }

  async create(unit: Unit): Promise<UnitResponseDTO> {
    try {
      const savedUnit = await this._dbUnitRepository.save(unit);
      return this._unitMapper.toResponseDTO(savedUnit);
    } catch (error: any) {
      logger.error('Error creating unit', { error: error.message, stack: error.stack });
      throw new HttpError(
        error.status || 500,
        error.message || 'Failed to create unit',
      );
    }
  }

  async update(id: number, unit: Unit): Promise<UnitResponseDTO | void> {
    try {
      const existingUnit = await this._dbUnitRepository.update(id, unit);
      if (existingUnit.affected === 0) {
        throw new HttpError(404, `Unit with id ${id} not found`);
      }
      const updatedUnit = await this._dbUnitRepository.findOneBy({ id });
      if (updatedUnit) {
        return this._unitMapper.toResponseDTO(updatedUnit);
      }
    } catch (error: any) {
      logger.error('Error updating unit', { id, error: error.message, stack: error.stack });
      throw new HttpError(
        error.status || 500,
        error.message || `Failed to update unit with id ${id}`,
      );
    }
  }

  async delete(id: number): Promise<UnitResponseDTO | void> {
    try {
      const unit = await this._dbUnitRepository.findOneBy({ id });
      if (unit) {
        await this._dbUnitRepository.delete(id);
        return this._unitMapper.toResponseDTO(unit);
      } else {
        throw new HttpError(404, `Unit with id ${id} not found`);
      }
    } catch (error: any) {
      logger.error('Error deleting unit', { id, error: error.message, stack: error.stack });
      throw new HttpError(
        error.status || 500,
        error.message || `Failed to delete unit with id ${id}`,
      );
    }
  }
}