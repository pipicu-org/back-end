import { ICLientRepository } from '../../client/client.repository';
import { Order } from '../order';
import { OrderRequestDTO } from '../DTO/request/orderRequestDTO';
import { Repository } from 'typeorm';
import { State } from '../state';
import { Line } from '../line';
import { IProductRepository } from '../../product/product.repository';

export class OrderFactory {
  constructor(
    private readonly clientRepository: ICLientRepository,
    private readonly stateRepository: Repository<State>,
    private readonly productRepository: IProductRepository,
  ) {}
  public async createOrderFromRequestDTO(
    requestDTO: OrderRequestDTO,
  ): Promise<Order> {
    try {
      const client = await this.clientRepository.getById(requestDTO.clientId);
      if (!client) {
        throw new Error(`Client with ID ${requestDTO.clientId} not found`);
      }
      const state = await this.stateRepository.findOne({
        where: { name: 'Pendiente' },
      });
      if (!state) {
        throw new Error(`No hay un estado 'Pendiente' definido`);
      }
      const horarioEntrega = requestDTO.horarioEntrega;

      const lines: Line[] = await Promise.all(
        requestDTO.lines.map(async (line) => {
          const lineItem = new Line();
          const product = await this.productRepository.findById(line.productId);
          if (!product) {
            throw new Error(`Product with ID ${line.productId} not found`);
          }
          lineItem.product = product;
          lineItem.quantity = line.quantity;
          lineItem.totalPrice = product.price * line.quantity;
          return lineItem;
        }),
      );

      const order = new Order();
      order.state = state;
      order.client = client;
      order.lines = lines;
      order.horarioEntrega = horarioEntrega;
      return order;
    } catch (error) {
      console.error('Error creating order from request DTO:', error);
      throw new Error('Failed to create order');
    }
  }
}
