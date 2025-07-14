import { Line, State } from '../models/entity';

interface ILineService {
  changeStateLine(lineId: number, state: State): Promise<Line | null>;
  findById(id: number): Promise<Line | null>;
}
