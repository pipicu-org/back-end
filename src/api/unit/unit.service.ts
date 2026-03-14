import { CreateUnitDto, UpdateUnitDto } from '../models/DTO/request/unitRequestDTO';
import { UnitResponseDTO } from '../models/DTO/response/unitResponseDTO';

export interface IUnitService {
  createUnit(unit: CreateUnitDto): Promise<UnitResponseDTO>;
  getAllUnits(page?: number, limit?: number, search?: string, sortBy?: string, sortOrder?: 'ASC' | 'DESC'): Promise<{ data: UnitResponseDTO[]; total: number; page: number; limit: number }>;
  getUnitById(id: number): Promise<UnitResponseDTO | void>;
  updateUnit(id: number, unit: UpdateUnitDto): Promise<UnitResponseDTO | void>;
  deleteUnit(id: number): Promise<UnitResponseDTO | void>;
}