import { Unit } from '../../entity/unit';

export interface IUnitResponseDTO {
  id: number;
  name: string;
  factor: number;
  createdAt: Date;
  updatedAt: Date;
}

export class UnitResponseDTO implements IUnitResponseDTO {
  id: number;
  name: string;
  factor: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(unit: Unit) {
    this.id = unit.id;
    this.name = unit.name;
    this.factor = unit.factor;
    this.createdAt = unit.createdAt;
    this.updatedAt = unit.updatedAt;
  }
}