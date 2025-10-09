import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import { Transform } from 'class-transformer';

interface IStockMovementRequestDTO {
  ingredientId: number;
  quantity: number;
  unitId: number;
  stockMovementTypeId: number;
  purchaseItemId?: number | null;
}

export class StockMovementRequestDTO implements IStockMovementRequestDTO {
  @IsNotEmpty({ message: 'Ingredient ID is required' })
  @IsNumber({}, { message: 'Ingredient ID must be a number' })
  ingredientId!: number;

  @IsNotEmpty({ message: 'Quantity is required' })
  @IsNumber({}, { message: 'Quantity must be a number' })
  @Min(0, { message: 'Quantity must be at least 0' })
  @Transform(({ value }) => parseFloat(value))
  quantity!: number;

  @IsNotEmpty({ message: 'Unit ID is required' })
  @IsNumber({}, { message: 'Unit ID must be a number' })
  unitId!: number;

  @IsNotEmpty({ message: 'Stock Movement Type ID is required' })
  @IsNumber({}, { message: 'Stock Movement Type ID must be a number' })
  stockMovementTypeId!: number;

  @IsOptional()
  @IsNumber({}, { message: 'Purchase Item ID must be a number' })
  purchaseItemId?: number | null;
}
