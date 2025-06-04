import { IOrderRepository } from '../../order/order.repository';
import { IProductRepository } from '../../product/product.repository';
import { LineRequestDTO } from '../DTO/request/lineRequestDTO';
import { Line } from '../line';

export class LineFactory {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly productRepository: IProductRepository,
  ) {}
  public async createLineFromRequestDTO(
    requestDTO: LineRequestDTO,
  ): Promise<Line> {
    try {
      const order = await this.orderRepository.getById(requestDTO.orderId);
      if (!order) {
        throw new Error(`Order with ID: ${requestDTO.orderId} not found`);
      }

      const product = await this.productRepository.findById(
        requestDTO.productId,
      );
      if (!product) {
        throw new Error(`Product with ID: ${requestDTO.productId} not found`);
      }

      const line = new Line();
      line.order = order;
      line.product = product;
      line.quantity = requestDTO.quantity;
      line.totalPrice = product.price * requestDTO.quantity;

      return line;
    } catch (error) {
      console.error('Error creating line from request DTO:', error);
      throw new Error('Failed to create line');
    }
  }
}
