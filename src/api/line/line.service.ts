import { LineResponseDTO } from '../models/DTO/response/lineResponeDTO';
import { LineSearchResponseDTO } from '../models/DTO/response/lineSearchResponseDTO';
import { Line } from '../models/entity/line';

export interface ILineService {
  changeStateLine(
    lineId: number,
    stateId: number,
  ): Promise<LineResponseDTO | void>;
  findById(id: number): Promise<LineResponseDTO | void>;
  getLinesByOrderId(orderId: number): Promise<LineResponseDTO[]>;
  getLinesByState(
    stateId: number,
    page: number,
    limit: number,
  ): Promise<LineSearchResponseDTO>;
  deleteLines(lines: Line[]): Promise<void>;
}
