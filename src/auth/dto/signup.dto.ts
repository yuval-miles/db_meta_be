import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 20, { message: 'Password must be between 6 and  20 characters' })
  public password: string;
}
