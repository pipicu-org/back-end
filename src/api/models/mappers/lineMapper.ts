import { LineResponseDTO } from '../DTO/response/lineResponeDTO';
import { Line } from '../entity';

export class LineMapper {
  public toResponseDTO(line: Line): LineResponseDTO {
    return new LineResponseDTO(line);
  }
}
