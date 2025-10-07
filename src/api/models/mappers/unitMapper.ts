import { Unit } from '../entity/unit';
import { UnitResponseDTO } from '../DTO/response/unitResponseDTO';

export class UnitMapper {
  toResponseDTO(unit: Unit): UnitResponseDTO {
    return new UnitResponseDTO(unit);
  }
}