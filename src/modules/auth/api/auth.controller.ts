import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../application (BLL)/auth.service';
import { LoginDTO } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(protected authService: AuthService) {}

  @Post('/login')
  async authLogin(
    @Body()
    { loginOrEmail, password }: LoginDTO,
  ) {
    return await this.authService.authLogin(loginOrEmail, password);
  }
}
