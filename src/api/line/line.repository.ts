import { Repository } from 'typeorm';
import { Line } from '../models/line';

export interface ILineRepository {
  create(line: Partial<Line>): Promise<Line>;
  getById(id: number): Promise<Line | null>;
  update(id: number, newLine: Partial<Line>): Promise<Line | null>;
  delete(id: number): Promise<Line | null>;
  getByClientId(clientId: number): Promise<Line[]>;
  getByOrderId(orderId: number): Promise<Line[]>;
  getByProductId(productId: number): Promise<Line[]>;
}

export class LineRepository implements ILineRepository {
  constructor(private readonly lineRepository: Repository<Line>) {}

  async create(line: Partial<Line>): Promise<Line> {
    try {
      return await this.lineRepository.save(line);
    } catch (error) {
      console.error('Error al crear una line:', error);
      throw new Error('No se pudo crear la line');
    }
  }

  async getById(id: number): Promise<Line | null> {
    try {
      const line = await this.lineRepository.findOneBy({ id });
      return line;
    } catch (error) {
      console.error('Error al obtener la line:', error);
      throw new Error('No se pudo obtener la line');
    }
  }

  async update(id: number, newLine: Partial<Line>): Promise<Line | null> {
    try {
      await this.lineRepository.update(id, newLine);
      const updatedLine = await this.lineRepository.findOneBy({ id });
      return updatedLine;
    } catch (error) {
      console.error('Error al actualizar la line:', error);
      throw new Error('No se pudo actualizar la line');
    }
  }

  async delete(id: number): Promise<Line | null> {
    try {
      const line = await this.lineRepository.findOneBy({ id });
      await this.lineRepository.delete(id);
      return line;
    } catch (error) {
      console.error('Error al eliminar la line:', error);
      throw new Error('No se pudo eliminar la line');
    }
  }

  async getByClientId(clientId: number): Promise<Line[]> {
    try {
      const lines = await this.lineRepository.find({
        where: { order: { client: { id: clientId } } },
      });
      return lines;
    } catch (error) {
      console.error('Error al obtener las lines por clientId:', error);
      throw new Error('No se pudieron obtener las lines por clientId');
    }
  }
  async getByOrderId(orderId: number): Promise<Line[]> {
    try {
      const lines = await this.lineRepository.find({
        where: { order: { id: orderId } },
      });
      return lines;
    } catch (error) {
      console.error('Error al obtener las lines por orderId:', error);
      throw new Error('No se pudieron obtener las lines por orderId');
    }
  }

  async getByProductId(productId: number): Promise<Line[]> {
    try {
      const lines = await this.lineRepository.find({
        where: { product: { id: productId } },
      });
      return lines;
    } catch (error) {
      console.error('Error al obtener las lines por productId:', error);
      throw new Error('No se pudieron obtener las lines por productId');
    }
  }
}
