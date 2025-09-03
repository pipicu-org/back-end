import { Repository } from 'typeorm';
import { Line, State, Transition, TransitionType } from '../models/entity';
import { LineResponseDTO } from '../models/DTO/response/lineResponeDTO';
import { LineMapper } from '../models/mappers/lineMapper';
import { LineSearchResponseDTO } from '../models/DTO/response/lineSearchResponseDTO';

export interface ILineRepository {
  changeStateLine(
    lineId: number,
    state: number,
  ): Promise<LineResponseDTO | void>;
  findById(id: number): Promise<LineResponseDTO | void>;
  getLinesByOrderId(orderId: number): Promise<LineResponseDTO[]>;
  getLinesByState(
    stateId: number,
    page: number,
    limit: number,
  ): Promise<LineSearchResponseDTO>;
}

export class LineRepository implements ILineRepository {
  constructor(
    private readonly _dbLineRepository: Repository<Line>,
    private readonly _dbStateRepository: Repository<State>,
    private readonly _dbTransitionRepository: Repository<Transition>,
    private readonly _dbTransitionTypeRepository: Repository<TransitionType>,
    private readonly _lineMapper: LineMapper,
  ) {}

  async changeStateLine(
    lineId: number,
    stateId: number,
  ): Promise<LineResponseDTO | void> {
    try {
      const line = await this._dbLineRepository
        .createQueryBuilder('line')
        .where('line.id = :lineId', { lineId })
        .leftJoinAndSelect('line.preparation', 'preparation')
        .leftJoinAndSelect('preparation.state', 'state')
        .leftJoinAndSelect('line.order', 'order')
        .leftJoinAndSelect('order.client', 'client')
        .leftJoinAndSelect('line.product', 'product')
        .getOne();
      if (!line) {
        throw new Error(`Line with id ${lineId} not found`);
      }
      const newstate = await this._dbStateRepository.findOne({
        where: { id: stateId },
      });
      if (!newstate) {
        throw new Error(`State with id ${newstate} not found`);
      }
      line.preparation.state = newstate;
      const transitionType = await this._dbTransitionTypeRepository.findOne({
        where: { name: 'Line State Transition' },
      });
      if (!transitionType) {
        throw new Error('Transition type "Line State Transition" not found');
      }
      await this._dbTransitionRepository
        .createQueryBuilder('transition')
        .insert()
        .values({
          transitionType: transitionType,
          createdAt: new Date(),
          fromState: line.preparation.state,
          toState: newstate,
          transitionatorId: line.id,
          duration: Date.now() - line.addedAt.getTime(),
        })
        .execute();
      await this._dbLineRepository.save(line);
      return this._lineMapper.toResponseDTO(line);
    } catch (error) {
      console.error(`Error changing state of line with id ${lineId}:`, error);
      throw new Error('Failed to change line state');
    }
  }

  async findById(id: number): Promise<LineResponseDTO | void> {
    try {
      const line = await this._dbLineRepository
        .createQueryBuilder('line')
        .leftJoinAndSelect('line.preparation', 'preparation')
        .leftJoinAndSelect('preparation.state', 'state')
        .leftJoinAndSelect('line.order', 'order')
        .leftJoinAndSelect('order.client', 'client')
        .leftJoinAndSelect('line.product', 'product')
        .where('line.id = :id', { id })
        .getOne();
      if (!line) {
        throw new Error(`Line with id ${id} not found`);
      }
      return this._lineMapper.toResponseDTO(line);
    } catch (error) {
      console.error(`Error fetching line with id ${id}:`, error);
      throw new Error('Failed to fetch line');
    }
  }

  async getLinesByOrderId(orderId: number): Promise<LineResponseDTO[]> {
    try {
      const lines = await this._dbLineRepository
        .createQueryBuilder('line')
        .leftJoinAndSelect('line.preparation', 'preparation')
        .leftJoinAndSelect('preparation.state', 'state')
        .leftJoinAndSelect('line.order', 'order')
        .leftJoinAndSelect('order.client', 'client')
        .leftJoinAndSelect('line.product', 'product')
        .where('order.id = :orderId', { orderId })
        .getMany();
      return lines.map((line) => this._lineMapper.toResponseDTO(line));
    } catch (error) {
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
      const linesAndCount = await this._dbLineRepository
        .createQueryBuilder('line')
        .leftJoinAndSelect('line.order', 'order')
        .leftJoinAndSelect('line.preparation', 'preparation')
        .leftJoinAndSelect('preparation.state', 'state')
        .leftJoinAndSelect('order.client', 'client')
        .leftJoinAndSelect('line.product', 'product')
        .where('state.id = :stateId', { stateId })
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();
      return this._lineMapper.toSearchResponseDTO(linesAndCount, page, limit);
    } catch (error) {
      console.error(`Error fetching lines by state with id ${stateId}:`, error);
      throw new Error('Failed to fetch lines by state');
    }
  }
}
