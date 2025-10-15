import {
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePurchaseItemDto {
  @IsNotEmpty({ message: 'Ingredient ID is required' })
  @IsNumber({}, { message: 'Ingredient ID must be a number' })
  ingredientId!: number;

  @IsNotEmpty({ message: 'Cost is required' })
  @IsNumber({}, { message: 'Cost must be a number' })
  @Min(0, { message: 'Cost must be positive' })
  cost!: number;

  @IsNotEmpty({ message: 'Quantity is required' })
  @IsNumber({}, { message: 'Quantity must be a number' })
  @Min(0, { message: 'Quantity must be positive' })
  quantity!: number;

  @IsNotEmpty({ message: 'Unit ID is required' })
  @IsNumber({}, { message: 'Unit ID must be a number' })
  unitId!: number;

  @IsNotEmpty({ message: 'Unit quantity is required' })
  @IsNumber({}, { message: 'Unit quantity must be a number' })
  @Min(0, { message: 'Unit quantity must be positive' })
  unitQuantity!: number;
}

export class CreatePurchaseDto {
  @IsNotEmpty({ message: 'Provider ID is required' })
  @IsNumber({}, { message: 'Provider ID must be a number' })
  providerId!: number;

  @IsArray({ message: 'Purchase items must be an array' })
  @ValidateNested({ each: true })
  @Type(() => CreatePurchaseItemDto)
  @IsNotEmpty({ message: 'Purchase items cannot be empty' })
  purchaseItems!: CreatePurchaseItemDto[];
}

export class UpdatePurchaseDto {
  @IsOptional()
  @IsNotEmpty({ message: 'Provider ID cannot be empty' })
  @IsNumber({}, { message: 'Provider ID must be a number' })
  providerId!: number;

  @IsOptional()
  @IsArray({ message: 'Purchase items must be an array' })
  @ValidateNested({ each: true })
  @Type(() => CreatePurchaseItemDto)
  @IsNotEmpty({ message: 'Purchase items cannot be empty' })
  purchaseItems!: CreatePurchaseItemDto[];
}
