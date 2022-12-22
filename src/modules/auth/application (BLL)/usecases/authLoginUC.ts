import { UsersRepository } from 'src/modules/users/infrastructure (DAL)/users.repository';
import { Injectable } from '@nestjs/common';
import { UsersType } from '../../../../types/types';
import { GenerateHash } from './generateHashUC';

@Injectable()
export class AuthLoginUC {
  constructor(
    protected usersRepository: UsersRepository,
    protected generateHash: GenerateHash,
  ) {}

  async _authLogin(
    loginOrEmail: string,
    password: string,
  ): Promise<boolean | UsersType> {
    const user = await this.usersRepository.findUserByLogin(loginOrEmail);
    if (!user) return false;
    const passwordHash = await this.generateHash._generateHash(
      password,
      user.passwordSalt,
    );
    if (user.passwordHash !== passwordHash) {
      return false;
    }
    return user;
  }
}
