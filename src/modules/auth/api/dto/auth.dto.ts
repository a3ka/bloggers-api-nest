import { IsString } from 'class-validator';

export class LoginDTO {
  @IsString()
  loginOrEmail: string;
  @IsString()
  password: string;
}
