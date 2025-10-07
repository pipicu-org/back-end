import { IsNotEmpty, IsOptional, IsNumber, Min } from 'class-validator';

export class CreateUnitDto {
  @IsNotEmpty({ message: 'Unit name is required' })
  name!: string;

  @IsNotEmpty({ message: 'Factor is required' })
  @IsNumber({}, { message: 'Factor must be a number' })
  @Min(0, { message: 'Factor must be positive' })
  factor!: number;
}

export class UpdateUnitDto {
  @IsOptional()
  @IsNotEmpty({ message: 'Unit name cannot be empty' })
  name?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Factor must be a number' })
  @Min(0, { message: 'Factor must be positive' })
  factor?: number;
}