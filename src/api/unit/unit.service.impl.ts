import { DataSource } from 'typeorm';
import { CreateUnitDto, UpdateUnitDto } from '../models/DTO/request/unitRequestDTO';
import { UnitResponseDTO } from '../models/DTO/response/unitResponseDTO';
import { Unit } from '../models/entity';
import { UnitMapper } from '../models/mappers/unitMapper';
import { IUnitRepository } from './unit.repository';
import { IUnitService } from './unit.service';
import { HttpError } from '../../errors/httpError';
import logger from '../../config/logger';

export class UnitService implements IUnitService {
  constructor(
    private readonly _unitRepository: IUnitRepository,
    private readonly _unitMapper: UnitMapper,
    private readonly _dataSource: DataSource,
  ) {}

  async createUnit(unitDto: CreateUnitDto): Promise<UnitResponseDTO> {
    try {
      const unit = new Unit();
      unit.name = unitDto.name;
      unit.factor = unitDto.factor;
      return await this._unitRepository.create(unit);
    } catch (error: any) {
      logger.error('Error creating unit', { error: error.message, stack: error.stack });
      throw new HttpError(500, 'Failed to create unit');
    }
  }

  async getAllUnits(): Promise<UnitResponseDTO[]> {
    return await this._unitRepository.findAll();
  }

  async getUnitById(id: number): Promise<UnitResponseDTO | void> {
    return await this._unitRepository.findById(id);
  }

  async updateUnit(id: number, unitDto: UpdateUnitDto): Promise<UnitResponseDTO | void> {
    try {
      const unit = new Unit();
      if (unitDto.name !== undefined) {
        unit.name = unitDto.name;
      }
      if (unitDto.factor !== undefined) {
        unit.factor = unitDto.factor;
      }
      return await this._unitRepository.update(id, unit);
    } catch (error: any) {
      logger.error('Error updating unit', { id, error: error.message, stack: error.stack });
      throw new HttpError(500, `Failed to update unit with id ${id}`);
    }
  }

  async deleteUnit(id: number): Promise<UnitResponseDTO | void> {
    return await this._unitRepository.delete(id);
  }
}