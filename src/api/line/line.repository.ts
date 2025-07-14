import { Repository } from 'typeorm';
import { Line, State } from '../models/entity';

interface ILineRepository {
  changeStateLine(lineId: number, state: State): Promise<Line | null>;
  findById(id: number): Promise<Line | null>;
}

export class LineRepository implements ILineRepository {
  constructor(private readonly _dbLineRepository: Repository<Line>) {}

  async changeStateLine(lineId: number, state: State): Promise<Line | null> {
    try {
      const line = await this._dbLineRepository
        .createQueryBuilder('line')
        .leftJoinAndSelect('line.preparation', 'preparation')
        .leftJoinAndSelect('preparation.state', 'state')
        .where('line.id = :lineId', { lineId })
        .getOne();
      if (!line) {
        throw new Error(`Line with id ${lineId} not found`);
      }
      line.preparation.state = state;
      return await this._dbLineRepository.save(line);
    } catch (error) {
      console.error(`Error changing state of line with id ${lineId}:`, error);
      throw new Error('Failed to change line state');
    }
  }

  async findById(id: number): Promise<Line | null> {
    try {
      return await this._dbLineRepository.findOne({
        where: { id },
      });
    } catch (error) {
      console.error(`Error fetching line with id ${id}:`, error);
      throw new Error('Failed to fetch line');
    }
  }
}
