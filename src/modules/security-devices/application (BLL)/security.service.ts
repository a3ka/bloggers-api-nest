import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { SecurityRepository } from '../infrastructure (DAL)/security.repository';
import { QueryRepository } from '../../../queryRepository/query.repository';
import { GenerateHash } from '../../common-services/generate-hash';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SecurityService {
  constructor(
    private readonly securityRepository: SecurityRepository,
    private readonly queryRepository: QueryRepository,
    private readonly jwtService: JwtService,
  ) {}

  async createSession(
    userId: string,
    ip: string,
    title: string,
    lastActiveDate: string,
    rfToken?: string,
  ) {
    if (userId) {
      const newSession = {
        userId,
        ip,
        title,
        lastActiveDate,
        deviceId: +new Date().toString(),
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
      );

      if (!currentSession) return false;

      await this.queryRepository.addRFTokenToBlacklist(rfToken);

      await this.securityRepository.updateSession(
        result.sub,
        ip,
        title,
        lastActiveDate,
      );

      return true;
    }
  }
}
