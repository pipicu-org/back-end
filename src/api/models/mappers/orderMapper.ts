import { ICLientRepository } from '../../client/client.repository';
import { Repository } from 'typeorm';
import { IProductRepository } from '../../product/product.repository';
import { Line, Order, State } from '../entity';
import { OrderSearchResponseDTO } from '../DTO/response/orderSearchResponseDTO';
import { OrderResponseDTO } from '../DTO/response/orderResponseDTO';
import { OrderRequestDTO } from '../DTO/request/orderRequestDTO';

export class OrderMapper {
  constructor(
    private readonly clientRepository: ICLientRepository,
    private readonly productRepository: IProductRepository,
    private readonly stateRepository: Repository<State>,
  ) {}

  public ordersToOrderSearchResponseDTO(
    resultsAndCount: [Order[], number],
    search: string,
    page: number,
    limit: number,
  ): OrderSearchResponseDTO {
    return new OrderSearchResponseDTO(
      search,
      resultsAndCount[1],
      page,
      limit,
      resultsAndCount[0].map((order) => ({
        id: order.id.toString(),
        name: order.client.name,
        horario: order.deliveryTime.toISOString(),
        state: order.state.name,
        totalPrice: order.totalPrice,
      })),
    );
  }

  public orderToOrderResponseDTO(order: Order): OrderResponseDTO {
    return new OrderResponseDTO(order);
  }

  public async orderRequestDTOToOrder(
    orderRequest: OrderRequestDTO,
  ): Promise<Order> {
    const order = new Order();
    const client = await this.clientRepository.getClientByName(
      orderRequest.client,
    );
    if (!client) {
      throw new Error(`Client with name ${orderRequest.client} not found`);
    }
    order.client = client;
    order.deliveryTime = new Date(orderRequest.deliveryTime);
    order.totalPrice = await orderRequest.lines.reduce(async (total, line) => {
      const product = await this.productRepository.getByName(line.product);
      if (!product) {
        throw new Error(`Product with name ${line.product} not found`);
      }
      return (await total) + product.price * line.quantity;
    }, Promise.resolve(0));
    order.paymentMethod = orderRequest.paymentMethod;
    const state = await this.stateRepository.findOneBy({
      name: orderRequest.state,
    });
    if (!state) {
      throw new Error(`State with name ${orderRequest.state} not found`);
    }
    order.state = state;
    order.createdAt = new Date();
    order.lines = await Promise.all(
      orderRequest.lines.map(async (line) => {
        const entityLine = new Line();
        const product = await this.productRepository.getByName(line.product);
        if (!product) {
          throw new Error(`Product with name ${line.product} not found`);
        }
        entityLine.product = product;
        entityLine.quantity = line.quantity;
        entityLine.totalPrice = product.price * line.quantity;
        return entityLine;
      }),
    );
    return order;
  }
}
