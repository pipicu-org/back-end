import { LineResponseDTO } from '../models/DTO/response/lineResponeDTO';
import { LineSearchResponseDTO } from '../models/DTO/response/lineSearchResponseDTO';
import { Line } from '../models/entity/line';
import { ILineRepository } from './line.repository';
import { ILineService } from './line.service';

export class LineService implements ILineService {
  constructor(private readonly _lineRepository: ILineRepository) {}

  async changeStateLine(
    lineId: number,
    stateId: number,
  ): Promise<LineResponseDTO | void> {
    try {
      return await this._lineRepository.changeStateLine(lineId, stateId);
    } catch (error: any) {
      console.error(`Error changing state of line with id ${lineId}:`, error);
      throw new Error('Failed to change line state');
    }
  }

  async findById(id: number): Promise<LineResponseDTO | void> {
    try {
      return await this._lineRepository.findById(id);
    } catch (error: any) {
      console.error(`Error fetching line with id ${id}:`, error);
      throw new Error('Failed to fetch line');
    }
  }

  async getLinesByOrderId(orderId: number): Promise<LineResponseDTO[]> {
    try {
      return await this._lineRepository.getLinesByOrderId(orderId);
    } catch (error: any) {
      console.error(
        `Error fetching lines for order with id ${orderId}:`,
        error,
      );
      throw new Error('Failed to fetch lines for order');
    }
  }

  async getLinesByState(
    stateId: number,
    page: number,
    limit: number,
  ): Promise<LineSearchResponseDTO> {
    try {
      return await this._lineRepository.getLinesByState(stateId, page, limit);
    } catch (error: any) {
      console.error(`Error fetching lines with state ${stateId}:`, error);
      throw new Error('Failed to fetch lines by state');
    }
  }

  async deleteLines(lines: Line[]): Promise<void> {
    try {
      const lineIds = lines.map(line => line.id);
      await this._lineRepository.deleteLines(lineIds);
    } catch (error: any) {
      console.error('Error deleting lines:', error);
      throw new Error('Failed to delete lines');
    }
  }
}
