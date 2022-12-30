import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtCookiesAuthGuard extends AuthGuard('jwtCookies') {}
