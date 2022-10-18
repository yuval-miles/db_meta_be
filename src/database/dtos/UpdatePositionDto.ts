import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class UpdatePositionDto {
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  x: number;
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  y: number;
  @IsString()
  tableName: string;
  @IsString()
  dbId: string;
}
