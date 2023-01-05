import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SecurityService } from '../application (BLL)/security.service';
import { JwtAuthGuard } from '../../auth/api/guards/jwt-auth.guard';
import { BasicAuthGuard } from '../../auth/api/guards/basic-auth.guard';
import { DeviceName } from '../../../decorators/device-name.decorator';
import { Cookies } from '../../../decorators/cookies-parser.decorator';
import { SecurityRepository } from '../infrastructure (DAL)/security.repository';

@Controller('security')
export class SecurityController {
  constructor(
    protected securityService: SecurityService,
    private readonly securityRepository: SecurityRepository,
  ) {}

  @HttpCode(200)
  @Get('/devices')
  async getAllSessions(@Cookies('refreshToken') refreshToken: string) {
    debugger;
    const allSessions = await this.securityService.getAllSessions(refreshToken);
    if (allSessions) {
      return allSessions;
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

  @HttpCode(204)
  @Delete('/devices')
  async deleteAllOtherSessions(
    @Cookies('refreshToken') refreshToken: string,
    @DeviceName() title: string,
  ) {
    const result = await this.securityService.deleteAllOtherSessions(
      refreshToken,
      title,
    );

    if (result) {
      return true;
    } else {
      //404
      throw new BadRequestException([
        { message: 'Post with that Id was not found', field: 'postId' },
      ]);
    }
  }

  @HttpCode(204)
  @Delete('/devices/:sessionId')
  async deleteSessionById(
    @Cookies('refreshToken') refreshToken: string,
    @Param('sessionId') sessionId: string,
  ) {
    const session = await this.securityRepository.findSessionByItId(sessionId);
    const tokenData = await this.securityService.checkRefreshToken(
      refreshToken,
    );

    if (session.userId !== tokenData.sub) {
      throw new HttpException('dfgdg', HttpStatus.FORBIDDEN);
    }

    const result = await this.securityService.deleteSessionById(sessionId);

    if (result) {
      return true;
    } else {
      //404
      throw new BadRequestException([
        { message: 'Post with that Id was not found', field: 'postId' },
      ]);
    }
  }
}
