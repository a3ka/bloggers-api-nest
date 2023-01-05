import { IsEmail, IsString, Length } from 'class-validator';

export class RegistrationDTO {
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

export class ConfirmCodeDTO {
  @IsString()
  code: string;
}

export class ResendCodeDTO {
  @IsString()
  @IsEmail()
  email: string;
}
