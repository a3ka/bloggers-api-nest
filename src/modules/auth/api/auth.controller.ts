import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Body,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from '../application (BLL)/auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UsersRepository } from '../../users/infrastructure (DAL)/users.repository';
import { CreatePostDTO } from '../../posts/api/dto/posts.dto';
import { ConfirmCodeDTO, RegistrationDTO, ResendCodeDTO } from './dto/auth.dto';

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

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    const result = await this.authService.login(req.user._doc);
    return { accessToken: result.accessToken };
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async getProfile(@Request() req) {
    // const user = this.userRepo.findUserByLoginOrEmail(req.user.id);
    const user = this.usersRepository.findUserById(req.user.id);
    return user;
  }

  @HttpCode(204)
  @Post('/registration')
  async registration(
    @Body()
    { login, password, email }: RegistrationDTO,
  ) {
    const newUser = await this.authService.userRegistration(
      login,
      password,
      email,
    );

    if (newUser) {
      return true;
    } else {
      // throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      throw new BadRequestException([
        {
          message: 'User with that email is already exists',
          field: 'email',
        },
      ]);
    }
  }

  @HttpCode(204)
  @Post('/registration-confirmation')
  async registrationConfirmation(@Body() dto: ConfirmCodeDTO) {
    const result = await this.authService.registrationConfirmation(dto.code);
    if (result) {
      return true;
    } else {
      // throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      throw new BadRequestException([
        {
          message:
            'Your confirmation code is incorrect, expired or already been applied',
          field: '',
        },
      ]);
    }
  }

  @HttpCode(204)
  @Post('/registration-email-resending')
  async resendingConfirmCode(@Body() dto: ResendCodeDTO) {
    return await this.authService.resendEmailWithConfirmCode(dto.email);
  }
}
