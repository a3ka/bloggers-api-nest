import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersType } from 'src/types/types';
import { UsersRepository } from '../../users/infrastructure (DAL)/users.repository';
import { GenerateHash } from '../../users/application (BLL)/generate-hash';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from 'src/constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly hashGenerator: GenerateHash,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    loginOrEmail: string,
    pass: string,
  ): Promise<boolean | UsersType> {
    const user = await this.usersRepo.findUserByLoginOrEmail(loginOrEmail);

    if (!user) return false;
    const passHash = await this.hashGenerator._generateHash(
      pass,
      user.passwordSalt,
    );
    if (user.passwordHash !== passHash) {
      return false;
    }
    const {
      passwordHash,
      passwordSalt,
      createdAt,
      isConfirmed,
      ...restUserData
    } = user;
    return restUserData;
  }

  async login(user: any) {
    const payload = { sub: user.id };
    // const accessToken = this.jwtService.sign(user);
    // return {
    //   access_token: accessToken,
    // };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async getUserIdByToken(token: string) {
    try {
      // const result: any = await jwt.verify(
      const result: any = await this.jwtService.verify(token, {
        secret: JWT_SECRET,
      });
      if (result) {
        return result.userId;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }
}
