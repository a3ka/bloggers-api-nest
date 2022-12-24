import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersType } from 'src/types/types';
import { UsersRepository } from '../../users/infrastructure (DAL)/users.repository';
import { GenerateHash } from '../../users/application (BLL)/generate-hash';

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
    const { passwordHash, passwordSalt, ...restUserData } = user;
    return restUserData;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
