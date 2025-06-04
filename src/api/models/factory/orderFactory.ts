import { ICLientRepository } from '../../client/client.repository';
import { ILineRepository } from '../../line/line.repository';
import { IStateRepository } from '../../state/state.repository';
import { Order } from '../order';
import { OrderRequestDTO } from '../DTO/request/orderRequestDTO';

export class OrderFactory {
  constructor(
    private readonly clientRepository: ICLientRepository,
    private readonly stateRepository: IStateRepository,
    private readonly lineRepository: ILineRepository,
  ) {}
  public async createOrderFromRequestDTO(
    requestDTO: OrderRequestDTO,
  ): Promise<Order> {
    try {
      const client = await this.clientRepository.getById(requestDTO.clientId);
      if (!client) {
        throw new Error('Client not found');
      }

      const state = await this.stateRepository.getById(requestDTO.stateId);
      if (!state) {
        throw new Error('State not found');
      }

      const lines = await Promise.all(
        requestDTO.linesId.map(async (lineId) => {
          const line = await this.lineRepository.getById(lineId);
          if (!line) {
            throw new Error(`Line with ID: ${lineId} not found`);
          }
          return line;
        }),
      );

      const order = new Order(state, client, lines);

      return order;
    } catch (error) {
      console.error('Error creating order from request DTO:', error);
      throw new Error('Failed to create order');
    }
  }
}
