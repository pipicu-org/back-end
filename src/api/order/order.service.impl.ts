import { HttpError } from '../../errors/httpError';
import { ILineService } from '../line/line.service';
import { IProductService } from '../product/product.service';
import { IProductService } from '../product/product.service';
import { Line } from '../models/entity/line';
import { OrderRequestDTO } from '../models/DTO/request/orderRequestDTO';
import { ComandaResponseDTO } from '../models/DTO/response/comandaResponseDTO';
import { OrderResponseDTO } from '../models/DTO/response/orderResponseDTO';
import { OrderSearchResponseDTO } from '../models/DTO/response/orderSearchResponseDTO';
import { KitchenOrderResponseDTO } from '../models/DTO/response/kitchenOrderResponseDTO';
import { OrderMapper } from '../models/mappers/orderMapper';
import { IOrderRepository } from './order.repository';
import { IOrderService } from './order.service';
import { IStockMovementService } from '../stockMovement/stockMovement.service';

export class OrderService implements IOrderService {
  constructor(
    private readonly _orderRepository: IOrderRepository,
    private readonly _orderMapper: OrderMapper,
    private readonly _lineService: ILineService,
    private readonly _productService: IProductService,
  ) {}

  async create(orderRequest: OrderRequestDTO): Promise<OrderResponseDTO> {
    try {
      if (this._hasRepeatedProducts(orderRequest)) {
        throw new HttpError(400, 'Order contains repeated products');
      }
      const order =
        await this._orderMapper.orderRequestDTOToOrder(orderRequest);
      for (const line of order.lines) {
        await this._stockMovementService.createStockMovementForOrderLine(
          line,
          false,
        );
      }
      return await this._orderRepository.create(order);
    } catch (error: any) {
      console.error('Error creating order:', error);
      throw new HttpError(
        error.status || 500,
        error.message || 'Internal Server Error',
      );
    }
  }

  async getById(id: number): Promise<OrderResponseDTO> {
    return await this._orderRepository.getById(id);
  }

  async update(
    id: number,
    orderRequest: OrderRequestDTO,
  ): Promise<OrderResponseDTO> {
    if (this._hasRepeatedProducts(orderRequest)) {
      throw new HttpError(400, 'Order contains repeated products');
    }

    // Fetch existing order with lines
    const existingOrder = await this._orderRepository.getById(id);

    // Compare and update lines selectively
    const { updatedLines, deletedLines } = await this._compareAndUpdateLines(
      existingOrder,
      orderRequest.lines,
      id,
    );

    // Delete removed lines
    if (deletedLines.length > 0) {
      await this._lineService.deleteLines(deletedLines);
    }

    // Recalculate totals
    const recalculatedTotals = this._recalculateTotals(updatedLines);

    // Recalculate total cost
    let totalCost = 0;
    for (const line of updatedLines) {
      if (line.cost) {
        totalCost += line.cost * line.quantity;
      }
    }

    const updatedOrder =
      await this._orderMapper.orderRequestDTOToOrder(orderRequest);

    // Set the order relationship on all lines to ensure bidirectional relationship
    for (const line of updatedLines) {
      line.order = updatedOrder;
    }

    // Update order with new totals and lines
    const orderUpdate = {
      subTotal: Number(recalculatedTotals.subTotal),
      total: Number(recalculatedTotals.total),
      taxTotal: Number(recalculatedTotals.taxTotal),
      cost: Number(totalCost.toFixed(2)),
      lines: updatedLines,
    };

    Object.assign(updatedOrder, orderUpdate);

    // Ensure cost is properly set
    if (orderUpdate.cost !== undefined) {
      updatedOrder.cost = orderUpdate.cost;
    }

    return await this._orderRepository.update(id, updatedOrder);
  }

  private async _compareAndUpdateLines(
    existingOrder: OrderResponseDTO,
    newLines: Array<{
      product: { id: number };
      quantity: number;
      productType?: string;
    }>,
    orderId: number,
  ): Promise<{ updatedLines: Line[]; deletedLines: Line[] }> {
    const existingLines = existingOrder.lines;
    const updatedLines: Line[] = [];
    const deletedLines: Line[] = [];
    const newLineMap = new Map<
      number,
      { product: { id: number }; quantity: number; productType?: string }
    >();

    // Create map of new lines by product ID
    newLines.forEach((line) =>
      newLineMap.set(line.product.id, {
        product: line.product,
        quantity: line.quantity,
      }),
    );
    // Compare existing lines
    for (const existingLine of existingLines) {
      const newLine = newLineMap.get(Number(existingLine.product.id));
      if (newLine) {
        // Check if quantity changed
        if (Number(existingLine.quantity) !== newLine.quantity) {
          // Update line
          const updatedLine = await this._updateLine(existingLine.id, {
            product: {
              id: newLine.product.id,
            },
            quantity: newLine.quantity,
          });
          updatedLines.push(updatedLine);
        } else {
          // Keep existing line
          const lineEntity = await this._getLineEntityById(existingLine.id);
          updatedLines.push(lineEntity);
        }
        newLineMap.delete(Number(existingLine.product.id));
      } else {
        const lineEntity = await this._getLineEntityById(existingLine.id);
        console.info('[DEBUG] Handle stock movement for removed line');
        console.log(lineEntity);
        const productFound = await this._productService.getProductById(
          lineEntity.productId,
        );
        const productEntity =
          await this._productMapper.responseDTOToEntity(productFound);
        lineEntity.product = productEntity;
        await this._stockMovementService.createStockMovementForOrderLine(
          lineEntity,
          true,
        );
        deletedLines.push(lineEntity);
      }
    }

    // Add new lines
    for (const [, newLine] of newLineMap) {
      const newLineEntity = await this._createNewLine(newLine, orderId);
      const newLineEntity = await this._createNewLine(newLine, orderId);
      updatedLines.push(newLineEntity);
    }

    return { updatedLines, deletedLines };
    return { updatedLines, deletedLines };
  }

  private async _updateLine(
    lineId: string,
    newLineData: {
      product: { id: number };
      quantity: number;
      productType?: string;
    },
  ): Promise<Line> {
    // Fetch existing line entity
    const lineEntity = await this._getLineEntityById(lineId);
    const lastQuantity = lineEntity.quantity;
    console.log(
      `[DEBUG] Updating line ${lineId}: current quantity=${lineEntity.quantity}, new quantity=${newLineData.quantity}`,
    );
    console.log(
      `[DEBUG] Current unitPrice=${lineEntity.unitPrice}, current totalPrice=${lineEntity.totalPrice}`,
    );

    // Update quantity and recalculate totalPrice and subTotal
    // Update quantity and recalculate totalPrice and subTotal
    lineEntity.quantity = Number(newLineData.quantity);
    lineEntity.totalPrice = Number(
      (lineEntity.unitPrice * newLineData.quantity).toFixed(2),
    );

    // Calculate subTotal using pre-tax price (we need to fetch the product to get preTaxPrice)
    const product = await this._productService.getProductById(
      lineEntity.productId,
    );
    if (product) {
      lineEntity.subTotal = Number(
        (product.preTaxPrice * newLineData.quantity).toFixed(2),
      );
    } else {
      // Fallback: assume subTotal is the same as totalPrice if we can't get preTaxPrice
      lineEntity.subTotal = lineEntity.totalPrice;
    }

    lineEntity.updatedAt = new Date();

    // Update product if changed and recalculate cost
    // Update product if changed and recalculate cost
    if (lineEntity.productId !== newLineData.product.id) {
      lineEntity.productId = newLineData.product.id;
      console.log(
        `[DEBUG] Product changed from ${lineEntity.productId} to ${newLineData.product.id}`,
      );

      // Fetch the new product with recipe to recalculate cost
      const newProduct = await this._productService.getProductById(
        newLineData.product.id,
      );

      if (newProduct && newProduct.recipe && newProduct.recipe.ingredients) {
        let totalCost = 0;
        for (const recipeIngredient of newProduct.recipe.ingredients) {
          const ingredientCost = recipeIngredient.ingredient?.cost || 0;
          totalCost += ingredientCost * recipeIngredient.quantity;
        }
        lineEntity.cost = Number(totalCost.toFixed(2));
        // Note: We can't directly assign the DTO product to entity, so we keep the cost calculation
      } else {
        lineEntity.cost = 0; // Default to 0 if no recipe
      }
    } else {
      // If product didn't change, recalculate cost if recipe is available
      if (
        lineEntity.product &&
        lineEntity.product.recipe &&
        lineEntity.product.recipe.recipeIngredient
      ) {
        let totalCost = 0;
        for (const recipeIngredient of lineEntity.product.recipe
          .recipeIngredient) {
          const ingredientCost = recipeIngredient.ingredient?.cost || 0;
          totalCost += ingredientCost * recipeIngredient.quantity;
        }
        lineEntity.cost = Number(totalCost.toFixed(2));
      } else {
        // If product recipe is not loaded, try to fetch it using product service
        const productDTO = await this._productService.getProductById(
          lineEntity.productId,
        );

        if (productDTO && productDTO.recipe && productDTO.recipe.ingredients) {
          let totalCost = 0;
          for (const recipeIngredient of productDTO.recipe.ingredients) {
            const ingredientCost = recipeIngredient.ingredient?.cost || 0;
            totalCost += ingredientCost * recipeIngredient.quantity;
          }
          lineEntity.cost = Number(totalCost.toFixed(2));
        } else {
          lineEntity.cost = 0; // Default to 0 if no recipe
        }
      }
    }

    console.log(
      `[DEBUG] Updated line: quantity=${lineEntity.quantity}, totalPrice=${lineEntity.totalPrice}, cost=${lineEntity.cost}`,
    );

    return lineEntity;
  }

  private async _createNewLine(
    newLineData: {
      product: { id: number };
      quantity: number;
      productType?: string;
    },
    orderId: number,
  ): Promise<Line> {
    // Use orderMapper logic to create line
    // This is a simplified version - in practice, you'd need product repository
    const line = new Line();
    line.productId = newLineData.product.id;
    line.quantity = Number(newLineData.quantity);
    line.productTypeId = newLineData.productType === 'custom' ? 2 : 1;
    line.orderId = orderId; // Set the orderId

    // Fetch product to get unitPrice
    const product = await this._productService.getProductById(
      newLineData.product.id,
    );
    if (product) {
      line.unitPrice = product.price;
      line.totalPrice = Number(
        (product.price * newLineData.quantity).toFixed(2),
      );
      line.subTotal = Number(
        (product.preTaxPrice * newLineData.quantity).toFixed(2),
      ); // Use pre-tax price for subTotal

      // Calculate cost based on recipe
      if (product.recipe && product.recipe.ingredients) {
        let totalCost = 0;
        for (const recipeIngredient of product.recipe.ingredients) {
          const ingredientCost = recipeIngredient.ingredient?.cost || 0;
          totalCost += ingredientCost * recipeIngredient.quantity;
        }
        line.cost = Number((totalCost * newLineData.quantity).toFixed(2));
      } else {
        line.cost = 0;
      }
    } else {
      // Fallback if product not found
      line.unitPrice = 0;
      line.totalPrice = 0;
      line.subTotal = 0;
      line.cost = 0;
    }

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
    line.unitPrice = lineResponse.totalPrice / lineResponse.quantity;
    line.totalPrice = lineResponse.totalPrice;
    line.subTotal = lineResponse.totalPrice; // Approximation - should be pre-tax price
    line.orderId = orderId; // Set the orderId
    line.productId = lineResponse.product.id;
    // Note: cost is not available in the DTO, so it will be recalculated later
    return line;
  }

  private _recalculateTotals(lines: Line[]): {
    subTotal: number;
    total: number;
    taxTotal: number;
  } {
    let subTotal = 0;
    let total = 0;

    for (const line of lines) {
      // Use the subTotal column from the line entity
      const lineSubTotal = Number(line.subTotal);
      // Use the subTotal column from the line entity
      const lineSubTotal = Number(line.subTotal);
      const lineTotal = Number(line.totalPrice);
      subTotal += lineSubTotal;
      total += lineTotal;
    }

    const taxTotal = total - subTotal;

    // Ensure proper numeric conversion and rounding
    const roundedSubTotal = Number(subTotal.toFixed(2));
    const roundedTotal = Number(total.toFixed(2));
    const roundedTaxTotal = Number(taxTotal.toFixed(2));

    return {
      subTotal: roundedSubTotal,
      total: roundedTotal,
      taxTotal: roundedTaxTotal,
    };
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

  async changeStateOrder(
    orderId: number,
    stateId: number,
  ): Promise<OrderResponseDTO> {
    const order = await this._orderRepository.getById(orderId);
    if (!order) {
      throw new HttpError(404, `Order with id ${orderId} not found`);
    }
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
    productId?: number,
  ): Promise<KitchenOrderResponseDTO> {
    return await this._orderRepository.getKitchenOrders(page, limit, productId);
  }

  private _hasRepeatedProducts(order: OrderRequestDTO): boolean {
    const products = order.lines.map((line) => line.product.id);
    const uniqueProducts = new Set(products);
    return uniqueProducts.size !== products.length;
  }
}
