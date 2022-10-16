import { Transform } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';

export class AddDatabaseDto {
  @IsString()
  host: string;
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  port: number;
  @IsString()
  username: string;
  @IsString()
  password: string;
  @IsString()
  database: string;
}
