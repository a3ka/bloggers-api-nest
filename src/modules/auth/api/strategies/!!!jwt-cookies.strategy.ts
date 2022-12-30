import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import cookieExtractor from '/!!!cookieExtractor';

@Injectable()
export class JwtCookiesStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || '123',
    });
  }

  async validate(payload: any) {
    // return { userId: payload.sub, username: payload.username };
    return {
      id: payload.sub,
    };
  }
}
