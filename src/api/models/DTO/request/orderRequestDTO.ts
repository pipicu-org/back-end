import { Order } from '../../entity';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class OrderLineDTO {
  @IsNotEmpty({ message: 'Product ID is required' })
  @IsNumber({}, { message: 'Product ID must be a number' })
  product!: number;

  @IsNotEmpty({ message: 'Quantity is required' })
  @IsNumber({}, { message: 'Quantity must be a number' })
  quantity!: number;

  @IsOptional()
  @IsString({ message: 'Product type must be a string' })
  productType?: string;
}

export class OrderRequestDTO {
  @IsNotEmpty({ message: 'Client ID is required' })
  @IsNumber({}, { message: 'Client ID must be a number' })
  client!: number;

  @IsNotEmpty({ message: 'Delivery time is required' })
  @IsString({ message: 'Delivery time must be a string' })
  deliveryTime!: string;

  @IsNotEmpty({ message: 'Contact method is required' })
  @IsString({ message: 'Contact method must be a string' })
  contactMethod!: string;

  @IsNotEmpty({ message: 'Payment method is required' })
  @IsString({ message: 'Payment method must be a string' })
  paymentMethod!: string;

  @IsNotEmpty({ message: 'Lines are required' })
  @IsArray({ message: 'Lines must be an array' })
  @ValidateNested({ each: true })
  @Type(() => OrderLineDTO)
  lines!: OrderLineDTO[];

  constructor(order: Order) {
    this.client = order.client.id;
    this.deliveryTime = order.deliveryTime.toISOString();
    this.contactMethod = order.contactMethod;
    this.paymentMethod = order.paymentMethod;
    this.lines = order.lines.map((line) => ({
      product: line.product.id,
      quantity: line.quantity,
      productType: line.productTypeId === 2 ? 'custom' : 'standard',
    }));
  }
}
