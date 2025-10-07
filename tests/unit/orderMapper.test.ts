import { OrderMapper } from '../../src/api/models/mappers/orderMapper';
import { Order } from '../../src/api/models/entity/order';
import { OrderResponseDTO } from '../../src/api/models/DTO/response/orderResponseDTO';
import { OrderSearchResponseDTO } from '../../src/api/models/DTO/response/orderSearchResponseDTO';

const mockClientRepository = {
  findOneBy: jest.fn(),
};

const mockProductRepository = {
  find: jest.fn(),
};

const mockStateRepository = {
  findOneBy: jest.fn(),
};

const mockIngredientRepository = {
  findOneBy: jest.fn(),
};

describe('OrderMapper', () => {
  let orderMapper: OrderMapper;

  beforeEach(() => {
    jest.clearAllMocks();
    orderMapper = new OrderMapper(
      mockClientRepository as any,
      mockProductRepository as any,
      mockStateRepository as any,
      mockIngredientRepository as any,
    );
  });

  describe('orderToOrderResponseDTO', () => {
    it('should map order to response DTO', () => {
      const order: Order = {
        id: 1,
        clientId: 1,
        deliveryTime: new Date(),
        contactMethod: 'phone',
        paymentMethod: 'cash',
        stateId: 1,
        subTotal: 8,
        total: 10,
        taxTotal: 2,
        createdAt: new Date(),
        state: { name: 'Pending' } as any,
        client: { name: 'Client', phoneNumber: '123', address: 'Addr' } as any,
        lines: [],
      } as any;

      const result = orderMapper.orderToOrderResponseDTO(order);

      expect(result).toBeInstanceOf(OrderResponseDTO);
    });
  });

  describe('ordersToOrderSearchResponseDTO', () => {
    it('should create search response DTO', () => {
      const orders: Order[] = [{
        id: 1,
        clientId: 1,
        deliveryTime: new Date(),
        contactMethod: 'phone',
        paymentMethod: 'cash',
        stateId: 1,
        subTotal: 8,
        total: 10,
        taxTotal: 2,
        createdAt: new Date(),
        client: { name: 'Client' } as any,
        state: { name: 'Pending' } as any,
        lines: []
      } as Order];
      const search = 'Client';
      const page = 1;
      const limit = 10;
      const total = 1;

      const result = orderMapper.ordersToOrderSearchResponseDTO([orders, total], search, page, limit);

      expect(result).toBeInstanceOf(OrderSearchResponseDTO);
      expect(result.search).toBe(search);
      expect(result.total).toBe(total);
      expect(result.page).toBe(page);
      expect(result.limit).toBe(limit);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].id).toBe('1');
      expect(result.data[0].name).toBe(orders[0].client.name);
    });
  });
});