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
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from '../application (BLL)/auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UsersRepository } from '../../users/infrastructure (DAL)/users.repository';
import { ConfirmCodeDTO, RegistrationDTO, ResendCodeDTO } from './dto/auth.dto';
import { Cookies } from '../../../decorators/cookies-parser.decorator';
import { TokenPairType } from '../../../types/types';
import { UserIp } from '../../../decorators/user-ip.decorator';
import { SecurityService } from '../../security-devices/application (BLL)/security.service';
import { DeviceName } from '../../../decorators/device-name.decorator';
import { v4 as uuidv4 } from 'uuid';

@Controller('auth')
export class AuthController {
  // constructor(protected login: AuthLoginUC, protected jwtService: JwtService) {}
  constructor(
    protected authService: AuthService,
    protected securityService: SecurityService,
  ) {}

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(
    @Request() req,
    @Res({ passthrough: true }) res: Response,
    @UserIp() userIp: string,
    @DeviceName() title: string,
  ) {
    const lastActiveDate = new Date().toISOString();
    const deviceId = uuidv4();
    await this.securityService.createSession(
      req.user._doc.id,
      userIp,
      title,
      lastActiveDate,
      deviceId,
    );

    const jwtTokenPair = await this.authService.getRefreshAccessToken(
      req.user._doc,
      null,
      userIp,
      title,
      lastActiveDate,
      deviceId,
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    res.cookie('refreshToken', jwtTokenPair.refreshToken, {
      httpOnly: true,
      secure: false,
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return { accessToken: jwtTokenPair.accessToken };
  }

  @HttpCode(200)
  // @UseGuards(JwtCookiesAuthGuard)
  @Post('/refresh-token')
  async getNewRefreshAccessToken(
    @UserIp() userIp: string,
    @DeviceName() title: string,
    @Res({ passthrough: true }) res: Response,
    @Cookies('refreshToken') refreshToken: string,
  ) {
    const lastActiveDate = new Date().toISOString();
    ///fdsadfafafas
    await this.securityService.createSession(
      undefined,
      userIp,
      title,
      lastActiveDate,
    );

    const jwtTokenPair: boolean | TokenPairType =
      await this.authService.getRefreshAccessToken(
        null,
        refreshToken,
        userIp,
        title,
        lastActiveDate,
      );

    if (!jwtTokenPair) {
      // throw new HttpException('dfgdg', HttpStatus.UNAUTHORIZED);
      throw new UnauthorizedException([
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
      secure: false,
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return { accessToken: jwtTokenPair.accessToken };
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

  @HttpCode(204)
  @Post('/logout')
  async logout(
    @Cookies('refreshToken')
    refreshToken: string,
  ) {
    const result = await this.authService.logout(refreshToken);
    if (!result) {
      throw new UnauthorizedException([
        {
          message: 'Your token is incorrect, expired or in the blacklist',
          field: 'refreshToken',
        },
      ]);
    }
    return true;
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async getProfile(@Request() req) {
    const user = await this.authService.getProfile(req.user.id);
    if (user) {
      return user;
    } else {
      // throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      throw new BadRequestException([
        {
          message: 'the  access token should expire after 10 sec delay',
          field: 'access token',
        },
      ]);
    }
  }
}
