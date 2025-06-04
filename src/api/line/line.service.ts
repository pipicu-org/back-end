import { lineFactory } from '../../config';
import { LineRequestDTO } from '../models/DTO/request/lineRequestDTO';
import { LineResponseDTO } from '../models/DTO/response/lineResponseDTO';
import { ILineRepository } from './line.repository';

export interface ILineService {
  create(lineRequestDTO: LineRequestDTO): Promise<LineResponseDTO>;
  getById(id: number): Promise<LineResponseDTO | null>;
  update(id: number, newLine: LineRequestDTO): Promise<LineResponseDTO | null>;
  delete(id: number): Promise<LineResponseDTO | null>;
  getByClientId(clientId: number): Promise<LineResponseDTO[]>;
  getByOrderId(orderId: number): Promise<LineResponseDTO[]>;
  getByProductId(productId: number): Promise<LineResponseDTO[]>;
}

export class LineService implements ILineService {
  constructor(private readonly lineRepository: ILineRepository) {}

  async create(lineRequestDTO: LineRequestDTO): Promise<LineResponseDTO> {
    try {
      const line = await lineFactory.createLineFromRequestDTO(lineRequestDTO);
      const createdLine = await this.lineRepository.create(line);
      return new LineResponseDTO(createdLine);
    } catch (error) {
      throw new Error(`Error creating line: ${error}`);
    }
  }

  async getById(id: number): Promise<LineResponseDTO | null> {
    try {
      const line = await this.lineRepository.getById(id);
      if (!line) {
        return null;
      }
      return new LineResponseDTO(line);
    } catch (error) {
      throw new Error(`Error fetching line by ID: ${id}, ${error}`);
    }
  }

  async update(
    id: number,
    newLine: LineRequestDTO,
  ): Promise<LineResponseDTO | null> {
    try {
      const lineToUpdate = await lineFactory.createLineFromRequestDTO(newLine);
      const updatedLine = await this.lineRepository.update(id, lineToUpdate);
      if (!updatedLine) {
        return null;
      }
      return new LineResponseDTO(updatedLine);
    } catch (error) {
      throw new Error(`Error updating line with ID: ${id}, ${error}`);
    }
  }
  async delete(id: number): Promise<LineResponseDTO | null> {
    try {
      const deletedLine = await this.lineRepository.delete(id);
      if (!deletedLine) {
        return null;
      }
      return new LineResponseDTO(deletedLine);
    } catch (error) {
      throw new Error(`Error deleting line with ID: ${id}, ${error}`);
    }
  }
  async getByClientId(clientId: number): Promise<LineResponseDTO[]> {
    try {
      const lines = await this.lineRepository.getByClientId(clientId);
      return lines.map((line) => new LineResponseDTO(line));
    } catch (error) {
      throw new Error(
        `Error fetching lines by client ID: ${clientId}, ${error}`,
      );
    }
  }
  async getByOrderId(orderId: number): Promise<LineResponseDTO[]> {
    try {
      const lines = await this.lineRepository.getByOrderId(orderId);
      return lines.map((line) => new LineResponseDTO(line));
    } catch (error) {
      throw new Error(`Error fetching lines by order ID: ${orderId}, ${error}`);
    }
  }

  async getByProductId(productId: number): Promise<LineResponseDTO[]> {
    try {
      const lines = await this.lineRepository.getByProductId(productId);
      return lines.map((line) => new LineResponseDTO(line));
    } catch (error) {
      throw new Error(
        `Error fetching lines by product ID: ${productId}, ${error}`,
      );
    }
  }
}
