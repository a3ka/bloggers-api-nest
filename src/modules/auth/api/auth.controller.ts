import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../application (BLL)/auth.service';
import { LoginDTO } from './dto/auth.dto';
import { jwtService } from './jwt-service';

@Controller('auth')
export class AuthController {
  constructor(protected authService: AuthService) {}

  @Post('/login')
  async authLogin(
    @Body()
    { loginOrEmail, password }: LoginDTO,
  ) {
    const user = await this.authService.authLogin(loginOrEmail, password);
    if (user) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const token = await jwtService.createJWTPair(user);
      return token;
    } else {
      throw new BadRequestException([
        {
          message: 'User with that email or login was not found',
          field: 'user email or login',
        },
      ]);
    }
  }
}
