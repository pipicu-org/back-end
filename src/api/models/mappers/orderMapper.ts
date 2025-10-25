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
      const products = await this._productRepository.find({
        where: { id: In(productIds) },
        relations: [
          'recipe',
          'recipe.recipeIngredient',
          'recipe.recipeIngredient.ingredient',
        ],
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

          // Calculate cost based on recipe ingredients
          if (product.recipe && product.recipe.recipeIngredient) {
            let totalCost = 0;
            for (const recipeIngredient of product.recipe.recipeIngredient) {
              const ingredientCost = recipeIngredient.ingredient?.cost || 0;
              totalCost += ingredientCost * recipeIngredient.quantity;
            }
            console.log(totalCost);
            entityLine.cost = Number(
              (entityLine.quantity * totalCost).toFixed(2),
            );
          }

          return entityLine;
        }),
      );

      // Calculate total cost for the order
      let orderTotalCost = 0;
      for (const line of order.lines) {
        if (line.cost) {
          orderTotalCost += line.cost;
        }
      }
      order.cost = Number(orderTotalCost.toFixed(2));
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
