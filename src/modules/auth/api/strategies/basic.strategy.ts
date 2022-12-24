import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { BasicStratagy as Strategy } from 'passport-http';
import { basicConsants } from '../../../../constants';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super();
  }

  public validate = async (username, password): Promise<boolean> => {
    if (
      basicConsants.username === username &&
      basicConsants.password === password
    ) {
      return true;
    }
    throw new UnauthorizedException();
  };
}
