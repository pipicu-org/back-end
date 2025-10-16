import { In, Repository } from 'typeorm';
import { Client, Ingredient, Line, Order, Product, State } from '../entity';
import { OrderSearchResponseDTO } from '../DTO/response/orderSearchResponseDTO';
import { OrderResponseDTO } from '../DTO/response/orderResponseDTO';
import { OrderRequestDTO } from '../DTO/request/orderRequestDTO';
import { ComandaResponseDTO } from '../DTO/response/comandaResponseDTO';
import { PreparationResponseDTO } from '../DTO/response/preparationResponseDTO';
import { HttpError } from '../../../errors/httpError';

export class OrderMapper {
  constructor(
    private readonly clientRepository: Repository<Client>,
    private readonly productRepository: Repository<Product>,
    private readonly stateRepository: Repository<State>,
    private readonly ingredientRepository: Repository<Ingredient>,
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
        total: order.total,
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
      const productIds = orderRequest.lines.map((line) => line.product);
      const products = await this.productRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.recipe', 'recipe')
        .leftJoinAndSelect('recipe.recipeIngredient', 'recipeIngredient')
        .leftJoinAndSelect('recipeIngredient.ingredient', 'ingredient')
        .leftJoinAndSelect('recipeIngredient.unit', 'unit')
        .where({ id: In(productIds) })
        .getMany();
      if (!products || products.length === 0) {
        throw new HttpError(404, 'No products found');
      }
      if (!client) {
        throw new HttpError(
          404,
          `Client with id ${orderRequest.client} not found`,
        );
      }
      order.client = client;
      order.deliveryTime = orderRequest.deliveryTime
        ? new Date(orderRequest.deliveryTime)
        : new Date(Date.now() + 30 * 60 * 1000);
      order.total = 0;
      order.subTotal = 0;
      for (const line of orderRequest.lines) {
        const product = products.find(
          (p) => String(p.id) === String(line.product),
        );
        if (!product) {
          throw new HttpError(404, `Product with id ${line.product} not found`);
        }
        if (line.quantity <= 0) {
          throw new HttpError(
            400,
            `Quantity for product id ${line.product} must be greater than 0`,
          );
        }
        order.total += product.price * line.quantity;
        order.subTotal += product.preTaxPrice * line.quantity;
      }
      order.total = Number(order.total.toFixed(2));
      order.subTotal = Number(order.subTotal.toFixed(2));
      order.contactMethod = orderRequest.contactMethod;
      order.taxTotal = Number((order.total - order.subTotal).toFixed(2));
      order.paymentMethod = orderRequest.paymentMethod;
      const state = await this.stateRepository.findOneBy({
        id: 1,
      });
      if (!state) {
        throw new HttpError(404, `State with id 1 not found`);
      }
      order.state = state;
      order.createdAt = new Date();
      order.lines = await Promise.all(
        orderRequest.lines.map(async (line) => {
          const entityLine = new Line();
          const product = products.find(
            (p) => String(p.id) === String(line.product),
          );
          if (!product) {
            throw new HttpError(
              404,
              `Product with id ${line.product} not found`,
            );
          }
          // TODO: Implementar la nueva estructura de CustomProducts
          entityLine.product = product;
          entityLine.unitPrice = product.price;
          entityLine.quantity = line.quantity;
          entityLine.totalPrice = product.price * line.quantity;
          entityLine.createdAt = new Date();
          entityLine.order = order;
          entityLine.productTypeId = line.productType === 'custom' ? 2 : 1;
          return entityLine;
        }),
      );
      return order;
    } catch (error: any) {
      console.error('Error mapping OrderRequestDTO to Order:', error);
      throw error;
    }
  }

  public toPreparationResponseDTO(
    orders: Order[],
    total: number,
    page: number = 1,
    limit: number = 10,
  ): PreparationResponseDTO {
    try {
      return new PreparationResponseDTO(orders, total, page, limit);
    } catch (error: any) {
      console.error('Error creating preparation response DTO:', error);
      throw new HttpError(500, 'Failed to create preparation response DTO');
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
