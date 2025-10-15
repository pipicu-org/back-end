import { HttpError } from '../../errors/httpError';
import { ILineService } from '../line/line.service';
import { Line } from '../models/entity/line';
import { OrderRequestDTO } from '../models/DTO/request/orderRequestDTO';
import { ComandaResponseDTO } from '../models/DTO/response/comandaResponseDTO';
import { OrderResponseDTO } from '../models/DTO/response/orderResponseDTO';
import { OrderSearchResponseDTO } from '../models/DTO/response/orderSearchResponseDTO';
import { PreparationResponseDTO } from '../models/DTO/response/preparationResponseDTO';
import { OrderMapper } from '../models/mappers/orderMapper';
import { IOrderRepository } from './order.repository';
import { IOrderService } from './order.service';

export class OrderService implements IOrderService {
  constructor(
    private readonly _orderRepository: IOrderRepository,
    private readonly _orderMapper: OrderMapper,
    private readonly _lineService: ILineService,
  ) {}

  async create(orderRequest: OrderRequestDTO): Promise<OrderResponseDTO> {
    if (this._hasRepeatedProducts(orderRequest)) {
      throw new HttpError(400, 'Order contains repeated products');
    }
    const order =
      await this._orderMapper.orderRequestDTOToOrder(orderRequest);
    return await this._orderRepository.create(order);
  }

  async getById(id: number): Promise<OrderResponseDTO> {
    return await this._orderRepository.getById(id);
  }

  async update(
    id: number,
    orderRequest: OrderRequestDTO,
  ): Promise<OrderResponseDTO> {
    console.log(`[DEBUG] Starting update for order ID: ${id}`);
    console.log(`[DEBUG] OrderRequest lines:`, orderRequest.lines);

    if (this._hasRepeatedProducts(orderRequest)) {
      throw new HttpError(400, 'Order contains repeated products');
    }

    // Fetch existing order with lines
    const existingOrder = await this._orderRepository.getById(id);

    // Compare and update lines selectively
    const updatedLines = await this._compareAndUpdateLines(existingOrder, orderRequest.lines);

    // Recalculate totals
    const recalculatedTotals = this._recalculateTotals(updatedLines);

    // Update order with new totals and lines
    const orderUpdate = {
      subTotal: recalculatedTotals.subTotal,
      total: recalculatedTotals.total,
      taxTotal: recalculatedTotals.taxTotal,
      lines: updatedLines,
    };

    const updatedOrder = await this._orderMapper.orderRequestDTOToOrder(orderRequest);
    Object.assign(updatedOrder, orderUpdate);

    return await this._orderRepository.update(id, updatedOrder);
  }

  private async _compareAndUpdateLines(
    existingOrder: OrderResponseDTO,
    newLines: Array<{ product: { id: number }; quantity: number; productType?: string }>,
  ): Promise<Line[]> {
    console.log(`[DEBUG] Comparing lines for order ID: ${existingOrder.id}`);

    const existingLines = existingOrder.lines;
    const updatedLines: Line[] = [];
    const newLineMap = new Map<number, { product: { id: number }; quantity: number; productType?: string }>();

    // Create map of new lines by product ID
    newLines.forEach(line => newLineMap.set(line.product.id, line));

    // Compare existing lines
    for (const existingLine of existingLines) {
      const newLine = newLineMap.get(Number(existingLine.product.id));
      if (newLine) {
        // Check if quantity changed
        if (Number(existingLine.quantity) !== newLine.quantity) {
          // Update line
          const updatedLine = await this._updateLine(existingLine.id, newLine);
          updatedLines.push(updatedLine);
        } else {
          // Keep existing line
          const lineEntity = await this._getLineEntityById(existingLine.id);
          updatedLines.push(lineEntity);
        }
        newLineMap.delete(Number(existingLine.product.id));
      } else {
        // Remove line (will be handled by cascade delete)
      }
    }

    // Add new lines
    for (const [, newLine] of newLineMap) {
      const newLineEntity = await this._createNewLine(newLine);
      updatedLines.push(newLineEntity);
    }

    return updatedLines;
  }

  private async _updateLine(
    lineId: string,
    newLineData: { product: { id: number }; quantity: number; productType?: string },
  ): Promise<Line> {
    // Fetch existing line entity
    const lineEntity = await this._getLineEntityById(lineId);
    // Update quantity and recalculate totalPrice
    lineEntity.quantity = newLineData.quantity;
    lineEntity.totalPrice = lineEntity.unitPrice * newLineData.quantity;
    lineEntity.updatedAt = new Date();
    // Update product if changed
    if (lineEntity.productId !== newLineData.product.id) {
      lineEntity.productId = newLineData.product.id;
    }
    return lineEntity;
  }

  private async _createNewLine(
    newLineData: { product: { id: number }; quantity: number; productType?: string },
  ): Promise<Line> {
    // Use orderMapper logic to create line
    // This is a simplified version - in practice, you'd need product repository
    const line = new Line();
    line.productId = newLineData.product.id;
    line.quantity = newLineData.quantity;
    line.productTypeId = newLineData.productType === 'custom' ? 2 : 1;
    // Note: unitPrice and totalPrice would be set when product is fetched
    // For now, set defaults
    line.unitPrice = 0; // Would be fetched from product
    line.totalPrice = 0; // Would be calculated
    line.createdAt = new Date();
    line.updatedAt = new Date();
    return line;
  }

  private async _getLineEntityById(lineId: string): Promise<Line> {
    // Fetch line entity from repository
    const lineResponse = await this._lineService.findById(Number(lineId));
    if (!lineResponse) {
      throw new HttpError(404, `Line with id ${lineId} not found`);
    }
    // Convert DTO back to entity - this is a simplification
    // In a real implementation, you'd fetch the entity directly
    const line = new Line();
    line.id = Number(lineResponse.id);
    line.quantity = lineResponse.quantity;
    line.unitPrice = lineResponse.totalPrice / lineResponse.quantity; // Approximation
    line.totalPrice = lineResponse.totalPrice;
    return line;
  }

  private _recalculateTotals(lines: Line[]): { subTotal: number; total: number; taxTotal: number } {
    let subTotal = 0;
    let total = 0;

    for (const line of lines) {
      subTotal += line.unitPrice * line.quantity;
      total += line.totalPrice;
    }

    const taxTotal = total - subTotal;

    return { subTotal, total, taxTotal };
  }

  async delete(id: number): Promise<OrderResponseDTO> {
    return await this._orderRepository.delete(id);
  }

  async getOrdersByClientName(
    clientName: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<OrderSearchResponseDTO> {
    return await this._orderRepository.getOrdersByClientName(
      clientName,
      page,
      limit,
    );
  }

  async getOrdersByState(
    stateId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<OrderSearchResponseDTO> {
    return await this._orderRepository.getOrdersByState(stateId, page, limit);
  }

  private async _isOrderAbleToChangeState(
    order: OrderResponseDTO,
    newState: number,
  ): Promise<boolean> {
    const lines = await this._lineService.getLinesByOrderId(Number(order.id));
    if (!lines || lines.length === 0) {
      throw new HttpError(404, `No lines found for order with id ${order.id}`);
    }
    console.info(newState)
    // return lines.every((line) => line.state.id === newState);
    return true;
  }

  async changeStateOrder(
    orderId: number,
    stateId: number,
  ): Promise<OrderResponseDTO> {
    const order = await this._orderRepository.getById(orderId);
    if (!order) {
      throw new HttpError(404, `Order with id ${orderId} not found`);
    }
    // if (!(await this._isOrderAbleToChangeState(order, stateId))) {
    //   throw new HttpError(
    //     400,
    //     'Order cannot change state due to line states mismatch',
    //   );
    // }
    return await this._orderRepository.changeStateOrder(orderId, stateId);
  }

  async getComanda(
    page: number = 1,
    limit: number = 10,
  ): Promise<ComandaResponseDTO> {
    return await this._orderRepository.getComanda(page, limit);
  }

  async getKitchenOrders(
    page: number = 1,
    limit: number = 10,
  ): Promise<PreparationResponseDTO> {
    return await this._orderRepository.getKitchenOrders(page, limit);
  }

  private _hasRepeatedProducts(order: OrderRequestDTO): boolean {
    const products = order.lines.map((line) => line.product.id);
    const uniqueProducts = new Set(products);
    return uniqueProducts.size !== products.length;
  }
}