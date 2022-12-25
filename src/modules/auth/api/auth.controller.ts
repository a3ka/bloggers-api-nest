import { Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from '../application (BLL)/auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UsersRepository } from '../../users/infrastructure (DAL)/users.repository';

@Controller('auth')
export class AuthController {
  // constructor(protected login: AuthLoginUC, protected jwtService: JwtService) {}
  constructor(
    protected usersRepository: UsersRepository,
    protected authService: AuthService,
  ) {}
  //
  // @Post('/login')
  // async authLogin(
  //   @Body()
  //   { loginOrEmail, password }: LoginDTO,
  // ) {
  //   const user = await this.login._authLogin(loginOrEmail, password);
  //   if (user) {
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //     // @ts-ignore
  //     const token = await this.jwtService.createJWTPair(user);
  //     return token;
  //   } else {
  //     throw new BadRequestException([
  //       {
  //         message: 'User with that email or login was not found',
  //         field: 'user email or login',
  //       },
  //     ]);
  //   }
  // }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    const result = await this.authService.login(req.user._doc);
    return { accessToken: result.accessToken };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async getProfile(@Request() req) {
    // const user = this.userRepo.findUserByLoginOrEmail(req.user.id);
    const user = this.usersRepository.findUserById(req.user.id);
    return user;
  }
}
