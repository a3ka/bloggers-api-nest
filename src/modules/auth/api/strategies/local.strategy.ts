import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../../application (BLL)/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'loginOrEmail',
      passwordField: 'password',
    });
  }

  async validate(loginOrEmail: string, pass: string): Promise<any> {
    const user = await this.authService.validateUser(loginOrEmail, pass);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
