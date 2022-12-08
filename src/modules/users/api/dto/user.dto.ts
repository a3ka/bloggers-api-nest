import { IsEmail, IsNumber, IsString, Length } from 'class-validator';

export class CreateUserDTO {
  @Length(3, 10)
  @IsString()
  login: string;
  @Length(6, 20)
  @IsString()
  password: string;
  @IsString()
  @IsEmail()
  email: string;
}
