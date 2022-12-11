import { UsersType } from '../../../types/types';
import { UsersRepository } from 'src/modules/users/infrastructure (DAL)/users.repository';
import { GenerateHash } from './usecases/generateHashUC';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    // protected authRepository: AuthRepository,
    protected usersRepository: UsersRepository,
    protected generateHash: GenerateHash,
  ) {}

  async authLogin(
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
