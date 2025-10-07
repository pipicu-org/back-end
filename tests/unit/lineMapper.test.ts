import { LineMapper } from '../../src/api/models/mappers/lineMapper';
import { Line } from '../../src/api/models/entity/line';
import { LineResponseDTO } from '../../src/api/models/DTO/response/lineResponeDTO';
import { LineSearchResponseDTO } from '../../src/api/models/DTO/response/lineSearchResponseDTO';

describe('LineMapper', () => {
  let lineMapper: LineMapper;

  beforeEach(() => {
    lineMapper = new LineMapper();
  });

  describe('toResponseDTO', () => {
    it('should map line entity to response DTO', () => {
      const line: Line = {
        id: 1,
        note: '',
        productId: 1,
        productTypeId: 1,
        orderId: 1,
        unitPrice: 5,
        quantity: 2,
        totalPrice: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
        order: { id: 1, client: { id: 1, name: 'Client' } } as any,
        product: { id: 1, name: 'Product', price: 5 } as any,
        productType: { id: 1 } as any,
      } as Line;

      const result = lineMapper.toResponseDTO(line);

      expect(result).toBeInstanceOf(LineResponseDTO);
      expect(result.id).toBe(line.id);
      expect(result.quantity).toBe(line.quantity);
      expect(result.product.id).toBe(line.product.id);
      expect(result.product.name).toBe(line.product.name);
      expect(result.order.id).toBe(line.order.id);
      expect(result.order.clientName).toBe(line.order.client.name);
    });
  });

  describe('toSearchResponseDTO', () => {
    it('should create search response DTO', () => {
      const lines: Line[] = [{
        id: 1,
        note: '',
        productId: 1,
        productTypeId: 1,
        orderId: 1,
        unitPrice: 5,
        quantity: 2,
        totalPrice: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
        product: { id: 1, name: 'Product' } as any,
        order: { id: 1, client: { id: 1, name: 'Client' } } as any,
        productType: { id: 1 } as any,
      } as Line];
      const page = 1;
      const limit = 10;
      const total = 1;

      const result = lineMapper.toSearchResponseDTO([lines, total], page, limit);

      expect(result).toBeInstanceOf(LineSearchResponseDTO);
      expect(result.total).toBe(total);
      expect(result.page).toBe(page);
      expect(result.limit).toBe(limit);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].line.id).toBe(lines[0].id.toString());
      expect(result.data[0].line.quantity).toBe(lines[0].quantity);
      expect(result.data[0].line.product.id).toBe(lines[0].product.id.toString());
      expect(result.data[0].line.product.name).toBe(lines[0].product.name);
      expect(result.data[0].order.id).toBe(lines[0].order.id.toString());
      expect(result.data[0].client.id).toBe(lines[0].order.client.id.toString());
      expect(result.data[0].client.name).toBe(lines[0].order.client.name);
    });
  });
});