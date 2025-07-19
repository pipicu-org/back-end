import { Repository } from 'typeorm';
import { Client, Line, Order, Preparation, Product, State } from '../entity';
import { OrderSearchResponseDTO } from '../DTO/response/orderSearchResponseDTO';
import { OrderResponseDTO } from '../DTO/response/orderResponseDTO';
import { OrderRequestDTO } from '../DTO/request/orderRequestDTO';
import { ComandaResponseDTO } from '../DTO/response/comandaResponseDTO';

export class OrderMapper {
  constructor(
    private readonly clientRepository: Repository<Client>,
    private readonly productRepository: Repository<Product>,
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
        deliveryTime: order.deliveryTime.toISOString(),
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
    try {
      const order = new Order();
      const client = await this.clientRepository.findOneBy({
        id: orderRequest.client,
      });
      let products = await this.productRepository.find();
      if (!products || products.length === 0) {
        throw new Error('No products found');
      }
      if (!client) {
        throw new Error(`Client with id ${orderRequest.client} not found`);
      }
      order.client = client;
      order.deliveryTime = orderRequest.deliveryTime
        ? new Date(orderRequest.deliveryTime)
        : new Date(Date.now() + 30 * 60 * 1000);
      order.totalPrice = 0;
      for (const line of orderRequest.lines) {
        const product = products.find((p) => p.id === line.product);
        if (!product) {
          throw new Error(`Product with id ${line.product} not found`);
        }
        if (line.quantity <= 0) {
          throw new Error(
            `Quantity for product ${line.product} must be greater than 0`,
          );
        }
        order.totalPrice += product.price * line.quantity;
      }
      order.totalPrice = Number(order.totalPrice);
      order.paymentMethod = orderRequest.paymentMethod;
      const state = await this.stateRepository.findOneBy({
        id: 1,
      });
      if (!state) {
        throw new Error(`State with id 1 not found`);
      }
      order.state = state;
      order.createdAt = new Date();
      order.lines = await Promise.all(
        orderRequest.lines.map(async (line) => {
          const entityLine = new Line();
          const product = products.find((p) => p.id === line.product);
          if (!product) {
            throw new Error(`Product with id ${line.product} not found`);
          }
          entityLine.product = product;
          entityLine.quantity = line.quantity;
          entityLine.totalPrice = product.price * line.quantity;
          entityLine.addedAt = new Date();
          const preparation = new Preparation();
          preparation.state = order.state;
          entityLine.preparation = preparation;
          entityLine.order = order;
          return entityLine;
        }),
      );
      return order;
    } catch (error) {
      console.error('Error mapping OrderRequestDTO to Order:', error);
      throw new Error('Failed to map OrderRequestDTO to Order');
    }
  }

  public ordersToComandaResponseDTO(
    orders: [Order[], number],
    page: number = 1,
    limit: number = 10,
  ): ComandaResponseDTO {
    const [orderList, total] = orders;
    return new ComandaResponseDTO(
      page,
      limit,
      total,
      orderList.map((order) => ({
        client: {
          id: order.client.id.toString(),
          name: order.client.name,
        },
        lines: order.lines.map((line) => ({
          quantity: line.quantity,
          product: {
            id: line.product.id.toString(),
            name: line.product.name,
          },
        })),
      })),
    );
  }
}
