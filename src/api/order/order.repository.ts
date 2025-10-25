import { Repository } from 'typeorm';
import { Order, State, Transition, TransitionType } from '../models/entity';
import { OrderMapper } from '../models/mappers/orderMapper';
import { OrderSearchResponseDTO } from '../models/DTO/response/orderSearchResponseDTO';
import { OrderResponseDTO } from '../models/DTO/response/orderResponseDTO';
import { ComandaResponseDTO } from '../models/DTO/response/comandaResponseDTO';
import {
  KitchenOrderResponseDTO,
  KitchenOrderItemDTO,
} from '../models/DTO/response/kitchenOrderResponseDTO';
import { HttpError } from '../../errors/httpError';

export interface IOrderRepository {
  create(order: Partial<Order>): Promise<OrderResponseDTO>;

  getOrdersByClientName(
    clientName: string,
    page?: number,
    limit?: number,
  ): Promise<OrderSearchResponseDTO>;

  getOrdersByState(
    stateId: number,
    page?: number,
    limit?: number,
  ): Promise<OrderSearchResponseDTO>;

  getById(id: number): Promise<OrderResponseDTO>;

  update(id: number, newOrder: Partial<Order>): Promise<OrderResponseDTO>;

  delete(id: number): Promise<OrderResponseDTO>;

  changeStateOrder(orderId: number, stateId: number): Promise<OrderResponseDTO>;

  getComanda(page?: number, limit?: number): Promise<ComandaResponseDTO>;

  getKitchenOrders(
    page?: number,
    limit?: number,
    productId?: number,
  ): Promise<KitchenOrderResponseDTO>;
}

export class OrderRepository implements IOrderRepository {
  constructor(
    private readonly _dbOrderRepository: Repository<Order>,
    private readonly _dbStateRepository: Repository<State>,
    private readonly _dbTransitionRepository: Repository<Transition>,
    private readonly _dbTransitionTypeRepository: Repository<TransitionType>,
    private readonly _orderMapper: OrderMapper,
  ) {}

  async create(order: Partial<Order>): Promise<OrderResponseDTO> {
    try {
      const createdOrder = await this._dbOrderRepository.save(order);
      return this._orderMapper.orderToOrderResponseDTO(createdOrder);
    } catch (error: any) {
      console.error('Error creating order:', error);
      throw new HttpError(
        error.status || 500,
        error.message || 'could not create order',
      );
    }
  }

  async getOrdersByClientName(
    clientName: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<OrderSearchResponseDTO> {
    try {
      const orders = await this._dbOrderRepository
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.client', 'client')
        .leftJoinAndSelect('order.state', 'state')
        .where('client.name ILIKE :name', { name: `%${clientName}%` })
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();
      return this._orderMapper.ordersToOrderSearchResponseDTO(
        orders,
        clientName,
        page,
        limit,
      );
    } catch (error: any) {
      console.error('Error fetching orders by client name: ', error.message);
      throw new HttpError(
        error.status || 500,
        error.message || 'could not fetch orders by client name',
      );
    }
  }

  async getOrdersByState(
    stateId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<OrderSearchResponseDTO> {
    try {
      const state = await this._dbStateRepository
        .createQueryBuilder('state')
        .where('state.id = :id', { id: stateId })
        .getOne();
      if (!state) {
        throw new HttpError(404, `State with id ${stateId} not found`);
      }
      const orders = await this._dbOrderRepository
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.client', 'client')
        .leftJoinAndSelect('order.state', 'state')
        .where('state.id = :stateId', { stateId })
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();
      return this._orderMapper.ordersToOrderSearchResponseDTO(
        orders,
        state.name,
        page,
        limit,
      );
    } catch (error: any) {
      console.error('Error fetching orders by state: ', error);
      throw new HttpError(
        error.status || 500,
        error.message || 'could not fetch orders by state',
      );
    }
  }

  async getById(id: number): Promise<OrderResponseDTO> {
    try {
      const order = await this._dbOrderRepository
        .createQueryBuilder('order')
        .innerJoinAndSelect('order.client', 'client')
        .innerJoinAndSelect('order.state', 'state')
        .innerJoinAndSelect('order.lines', 'line')
        .innerJoinAndSelect('line.product', 'product')
        .innerJoinAndSelect('product.productType', 'productType')
        .where('order.id = :id', { id })
        .getOne();

      if (!order) throw new HttpError(404, `Order id ${id} not found`);
      return this._orderMapper.orderToOrderResponseDTO(order);
    } catch (error: any) {
      console.error('Error fetching order by ID: ', error);
      throw new HttpError(
        error.status || 500,
        error.message || 'could not fetch order by ID',
      );
    }
  }

  async changeStateOrder(
    orderId: number,
    stateId: number,
  ): Promise<OrderResponseDTO> {
    try {
      const order = await this._dbOrderRepository
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.client', 'client')
        .leftJoinAndSelect('order.state', 'state')
        .leftJoinAndSelect('order.lines', 'line')
        .leftJoinAndSelect('line.product', 'product')
        .leftJoinAndSelect('product.productType', 'productType')
        .where('order.id = :id', { id: orderId })
        .getOne();
      if (!order) {
        throw new HttpError(404, `Order with id ${orderId} not found`);
      }
      const state = await this._dbStateRepository.findOne({
        where: { id: stateId },
      });
      if (!state) {
        throw new HttpError(404, `State with id ${stateId} not found`);
      }
      order.state = state;
      const transitionType = await this._dbTransitionTypeRepository.findOne({
        where: { id: 1 },
      });
      if (!transitionType) {
        throw new HttpError(
          404,
          'Transition type "Order State Transition" not found',
        );
      }
      await this._dbTransitionRepository
        .createQueryBuilder('transition')
        .insert()
        .values({
          transitionType: transitionType,
          createdAt: new Date(),
          fromState: order.state,
          toState: state,
          transitionatorId: order.id,
          duration: Date.now() - order.createdAt.getTime(),
        })
        .execute();
      await this._dbOrderRepository.save(order);
      return this._orderMapper.orderToOrderResponseDTO(order);
    } catch (error: any) {
      console.error('Error changing order state: ', error);
      throw new HttpError(
        error.status || 500,
        error.message || 'could not change order state',
      );
    }
  }

  async getComanda(): Promise<ComandaResponseDTO> {
    try {
      const orders = await this._dbOrderRepository
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.client', 'client')
        .leftJoinAndSelect('order.state', 'state')
        .leftJoinAndSelect('order.lines', 'line')
        .leftJoinAndSelect('line.product', 'product')
        .leftJoinAndSelect('product.productType', 'productType')
        .where('state.id = :stateId', { stateId: 1 })
        .orderBy('order.createdAt', 'ASC')
        .getManyAndCount();
      return this._orderMapper.ordersToComandaResponseDTO(orders);
    } catch (error: any) {
      console.error('Error fetching comanda: ', error);
      throw new HttpError(
        error.status || 500,
        error.message || 'could not fetch comanda',
      );
    }
  }

  async getKitchenOrders(
    page = 1,
    limit = 10,
    productId?: number,
  ): Promise<KitchenOrderResponseDTO> {
    const offset = (page - 1) * limit;
    try {
      let query = `
      SELECT
        l."orderId",
        l.id AS "lineId",
        gs.n AS "preparationId",
        p.id AS "productId",
        p.name AS "productName",
        l.quantity,
        json_agg(
          json_build_object(
            'ingredientId', ri."ingredientId",
            'ingredientName', i.name,
            'quantity', ri.quantity,
            'unitName', u.name
          )
        ) AS "recipeIngredients"
      FROM "Line" l
      INNER JOIN "Order" o ON o.id = l."orderId"
      INNER JOIN "Product" p ON p.id = l."productId"
      INNER JOIN "Recipe" r ON r.id = p."recipeId"
      LEFT JOIN "RecipeIngredient" ri ON ri."recipeId" = r.id
      LEFT JOIN "Ingredient" i ON i.id = ri."ingredientId"
      LEFT JOIN "Unit" u ON u.id = ri."unitId"
      JOIN generate_series(1, l.quantity) AS gs(n) ON true
      WHERE o."stateId" = $1
      `;
      const queryParams: any[] = [2, limit, offset];
      if (productId) {
        query += ` AND p.id = $${queryParams.length + 1}`;
        queryParams.push(productId);
      }
      query += `
      GROUP BY l."orderId", l.id, gs.n, p.id, p.name, l.quantity, o."deliveryTime"
      ORDER BY o."deliveryTime" DESC, l.id, gs.n
      LIMIT $2 OFFSET $3
      `;
      const rawData = await this._dbOrderRepository.query(query, queryParams);

      let countQuery = `
      SELECT COUNT(*) AS total
      FROM (
        SELECT l.id, gs.n
        FROM "Line" l
        INNER JOIN "Order" o ON o.id = l."orderId"
        INNER JOIN "Product" p ON p.id = l."productId"
        INNER JOIN "Recipe" r ON r.id = p."recipeId"
        JOIN generate_series(1, l.quantity) AS gs(n) ON true
        WHERE o."stateId" = $1
      `;
      const countQueryParams = [2];
      if (productId) {
        countQuery += `    AND p.id = $${countQueryParams.length + 1}\n`;
        countQueryParams.push(productId);
      }
      countQuery += `        GROUP BY l.id, gs.n
      ) AS sub`;

      const totalResult = await this._dbOrderRepository.query(
        countQuery,
        countQueryParams,
      );
      const total = parseInt(totalResult[0].total, 10);
      const items = (rawData ?? []).map(
        (row: any) =>
          new KitchenOrderItemDTO(
            row.orderId,
            row.lineId,
            row.preparationId,
            row.productId,
            row.productName,
            row.quantity,
            row.recipeIngredients ?? [],
          ),
      );
      return new KitchenOrderResponseDTO(items, total, page, limit);
    } catch (error: any) {
      console.error('Error fetching kitchen orders:', error.message);
      throw new HttpError(
        error.status || 500,
        error.message || 'Could not fetch kitchen orders',
      );
    }
  }

  async update(
    id: number,
    newOrder: Partial<Order>,
  ): Promise<OrderResponseDTO> {
    try {
      newOrder.id = id;
      await this._dbOrderRepository.save(newOrder);
      return await this.getById(id);
    } catch (error: any) {
      console.error('Error updating order: ', error);
      throw new HttpError(error.status, error.message);
    }
  }

  async delete(id: number): Promise<OrderResponseDTO> {
    try {
      const order = await this.getById(id);
      if (!order) throw new Error(`Order with id ${id} not found`);
      await this._dbOrderRepository.delete(id);
      return order;
    } catch (error: any) {
      console.error('Error deleting order: ', error);
      throw new HttpError(
        error.status || 500,
        error.message || 'could not delete order',
      );
    }
  }
}
