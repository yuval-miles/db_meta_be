import { IsString } from 'class-validator';

export class SelectedDBDto {
  @IsString()
  id: string;
}
