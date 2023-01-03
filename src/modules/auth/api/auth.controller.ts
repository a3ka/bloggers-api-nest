import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Body,
  HttpCode,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from '../application (BLL)/auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UsersRepository } from '../../users/infrastructure (DAL)/users.repository';
import { ConfirmCodeDTO, RegistrationDTO, ResendCodeDTO } from './dto/auth.dto';
import { Cookies } from '../../../decorators/cookies-parser.decorator';
import { TokenPairType } from '../../../types/types';

@Controller('auth')
export class AuthController {
  // constructor(protected login: AuthLoginUC, protected jwtService: JwtService) {}
  constructor(
    protected usersRepository: UsersRepository,
    protected authService: AuthService,
  ) {}

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    // const jwtTokenPair = await this.authService.login(req.user._doc);

    const jwtTokenPair = await this.authService.getRefreshAccessToken(
      req.user._doc,
      null,
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    res.cookie('refreshToken', jwtTokenPair.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return { accessToken: jwtTokenPair.accessToken };
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async getProfile(@Request() req) {
    // const user = this.userRepo.findUserByLoginOrEmail(req.user.id);
    const user = this.usersRepository.findUserById(req.user.id);

    if (user) {
      return user;
    } else {
      // throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      throw new BadRequestException([
        {
          message: 'the  access token should expired after 10 sec delay',
          field: 'access token',
        },
      ]);
    }
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

  @HttpCode(200)
  // @UseGuards(JwtCookiesAuthGuard)
  @Post('/refresh-token')
  async getNewRefreshAccessToken(
    @Res({ passthrough: true }) res: Response,
    @Cookies('refreshToken')
    refreshToken: string,
  ) {
    if (!refreshToken) {
      throw new BadRequestException([
        {
          message: 'RefreshToken is not provided or expired',
          field: 'refreshToken',
        },
      ]);
    }

    const jwtTokenPair: boolean | TokenPairType =
      await this.authService.getRefreshAccessToken(null, refreshToken);

    if (!jwtTokenPair) {
      throw new BadRequestException([
        {
          message: 'Your token is incorrect, expired or in the blacklist',
          field: 'refreshToken',
        },
      ]);
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    res.cookie('refreshToken', jwtTokenPair.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return { accessToken: jwtTokenPair.accessToken };
  }

  @HttpCode(204)
  // @UseGuards(JwtCookiesAuthGuard)
  @Post('/logout')
  async logout(
    @Cookies('refreshToken')
    refreshToken: string,
  ) {
    if (refreshToken) {
      await this.authService.logout(refreshToken);
      return true;
    } else {
      throw new BadRequestException([
        {
          message: 'Token is not provided',
          field: 'refreshToken',
        },
      ]);
    }
  }
}
