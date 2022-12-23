import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { LoginDTO } from './dto/auth.dto';
import { JWTService } from '../application (BLL)/jwt.service';
import { AuthLoginUC } from '../application (BLL)/authLoginUC';

@Controller('auth')
export class AuthController {
  constructor(protected login: AuthLoginUC, protected jwtService: JWTService) {}

  @Post('/login')
  async authLogin(
    @Body()
    { loginOrEmail, password }: LoginDTO,
  ) {
    const user = await this.login._authLogin(loginOrEmail, password);
    if (user) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const token = await this.jwtService.createJWTPair(user);
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
