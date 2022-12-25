import jwt from 'jsonwebtoken';
import { UsersType } from '../../../ts-types';
import bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtServicexxxx {
  async generateHash(password: string, salt: string) {
    const hash = bcrypt.hash(password, salt);
    return hash;
  }

  async createJWTPair(user: UsersType) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || '123',
      { expiresIn: 100000 },
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || '123',
      { expiresIn: 200000 },
    );

    const jwtTokenPair = { accessToken, refreshToken };

    return jwtTokenPair;
  }

  async getUserIdByToken(token: string) {
    try {
      const result: any = await jwt.verify(
        token,
        process.env.JWT_SECRET || '123',
      );
      if (result) {
        return result.userId;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  async getTokenExpTime(token: string) {
    try {
      const result: any = await jwt.verify(
        token,
        process.env.JWT_SECRET || '123',
      );
      if (result) {
        return result.exp;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }

    // const result: any = await jwt.verify(token, process.env.JWT_SECRET || '123')
    // if(result) {
    //     return result.exp
    // } else {
    //     return false
    // }
  }
}
