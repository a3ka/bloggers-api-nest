import { Injectable } from '@nestjs/common';
import { SecurityRepository } from '../infrastructure (DAL)/security.repository';
import { QueryRepository } from '../../../queryRepository/query.repository';
import { JwtService } from '@nestjs/jwt';
import { SessionType, TokenPairType, UsersType } from '../../../types/types';
import { UsersRepository } from '../../users/infrastructure (DAL)/users.repository';

@Injectable()
export class SecurityService {
  constructor(
    private readonly securityRepository: SecurityRepository,
    private readonly queryRepository: QueryRepository,
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async createSession(
    userId: string,
    ip: string,
    title: string,
    lastActiveDate: string,
    deviceId?: string,
    rfToken?: string,
  ) {
    if (userId) {
      // const currentSession = await this.securityRepository.findCurrentSession2(
      //   userId,
      //   title,
      // );
      //
      // debugger;
      // if (!currentSession) return false;

      const newSession = {
        userId,
        ip,
        title,
        lastActiveDate,
        deviceId,
      };

      return this.securityRepository.createNewSession(newSession);
    }

    if (rfToken) {
      let result;
      try {
        result = await this.jwtService.verify(rfToken, {
          secret: process.env.JWT_SECRET || '123',
        });
      } catch (e) {
        return false;
      }

      const blacklist = await this.queryRepository.checkRFTokenInBlacklist(
        rfToken,
      );
      if (blacklist) return false;

      const currentSession = await this.securityRepository.findCurrentSession(
        result.sub,
        result.lastActiveDate,
        title,
      );

      if (!currentSession) return false;

      await this.securityRepository.updateSession(
        result.sub,
        ip,
        title,
        lastActiveDate,
      );

      return true;
    }
  }

  async getAllSessions(rfToken: string): Promise<boolean | SessionType[]> {
    const tokenData = await this.checkRefreshToken(rfToken);
    const allUserSessions = await this.securityRepository.findAllUserSessions(
      tokenData.sub,
    );
    if (allUserSessions) return allUserSessions;
    return false;
  }

  async deleteAllOtherSessions(
    rfToken: string,
    title: string,
  ): Promise<boolean> {
    const tokenData = await this.checkRefreshToken(rfToken);

    const currentSession = await this.securityRepository.findCurrentSession(
      tokenData.sub,
      tokenData.lastActiveDate,
      title,
    );

    await this.securityRepository.deleteAllUserSessions(tokenData.sub);
    await this.securityRepository.createNewSession(currentSession);
    const connectionsCount = await this.securityRepository.userSessionsCount(
      tokenData.sub,
    );

    if (connectionsCount === 1) return true;
    return false;
  }

  async logoutOfSession(rfToken: string): Promise<boolean | TokenPairType> {
    debugger;
    const tokenData = await this.checkRefreshToken(rfToken);
    debugger;
    const result = await this.deleteSessionById(tokenData.deviceId);
    return result;
  }

  async deleteSessionById(sessionId: string): Promise<boolean> {
    const result = await this.securityRepository.deleteSessionById(sessionId);
    if (result) return true;
    return false;
  }

  async checkRefreshToken(rfToken) {
    let tokenData;
    try {
      tokenData = await this.jwtService.verify(rfToken, {
        secret: process.env.JWT_SECRET || '123',
      });
    } catch (e) {
      return false;
    }

    const tokenExpTime = tokenData.exp;
    const blacklist = await this.queryRepository.checkRFTokenInBlacklist(
      rfToken,
    );

    if (blacklist) return false;
    if (!tokenData) return false;
    if (!tokenExpTime) return false;

    return tokenData;
  }
}
