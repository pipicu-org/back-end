import { In, Repository } from 'typeorm';
import { Client, Line, Order, Product, State } from '../entity';
import { OrderSearchResponseDTO } from '../DTO/response/orderSearchResponseDTO';
import { OrderResponseDTO } from '../DTO/response/orderResponseDTO';
import { OrderRequestDTO } from '../DTO/request/orderRequestDTO';
import { ComandaResponseDTO } from '../DTO/response/comandaResponseDTO';
import { PreparationResponseDTO } from '../DTO/response/preparationResponseDTO';
import { HttpError } from '../../../errors/httpError';

export class OrderMapper {
  constructor(
    private readonly _clientRepository: Repository<Client>,
    private readonly _productRepository: Repository<Product>,
    private readonly _stateRepository: Repository<State>,
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
      const client = await this._clientRepository.findOneBy({
        id: orderRequest.client,
      });
      const productIds = orderRequest.lines.map((line) => line.product.id);
      const products = await this.productRepository.findBy({
        id: In(productIds),
      });
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
          (p) => String(p.id) === String(line.product.id),
        );
        if (!product) {
          throw new HttpError(
            404,
            `Product with id ${line.product.id} not found`,
          );
        }
        if (line.quantity <= 0) {
          throw new HttpError(
            400,
            `Quantity for product id ${line.product.id} must be greater than 0`,
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
      const state = await this._stateRepository.findOneBy({
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
            (p) => String(p.id) === String(line.product.id),
          );
          if (!product) {
            throw new HttpError(
              404,
              `Product with id ${line.product.id} not found`,
            );
          }
          entityLine.productId = product.id;
          entityLine.product = product;
          entityLine.product.recipe = product.recipe;
          entityLine.unitPrice = product.price;
          entityLine.quantity = line.quantity;
          entityLine.totalPrice = product.price * line.quantity;
          entityLine.subTotal = product.preTaxPrice * line.quantity; // Calculate subTotal using pre-tax price
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
    rawData: any[],
    total: number,
    page: number = 1,
    limit: number = 10,
  ): ComandaResponseDTO {
    const data = rawData.map((row) => ({
      orderId: row.orderId,
      client: {
        id: row.clientId,
        name: row.clientName,
      },
      lines: row.lines.map((line: any) => ({
        lineId: line.lineId,
        quantity: line.quantity,
        product: {
          id: line.productId,
          name: line.productName,
        },
        recipe: line.recipe
          ? line.recipe.map((recipeItem: any) => ({
              ingredient: {
                id: recipeItem.ingredientId,
                name: recipeItem.ingredientName,
              },
              unit: {
                id: recipeItem.unitId,
                name: recipeItem.unitName,
              },
              quantity: recipeItem.quantity,
            }))
          : [],
      })),
    }));

    return new ComandaResponseDTO(page, limit, total, data);
  }
}
