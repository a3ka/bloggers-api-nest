import { AuthRepository } from '../infrastructure (DAL)/auth.repository';
import { UsersType } from '../../../types/types';
import { v4 as uuidv4 } from 'uuid';
import { UsersRepository } from 'src/modules/users/infrastructure (DAL)/users.repository';

export class AuthService {
  constructor(
    protected authRepository: AuthRepository,
    protected usersRepository: UsersRepository,
  ) {}

  async authLogin(
    loginOrEmail: string,
    password: string,
  ): Promise<UsersType | boolean> {
    const user = await this.usersRepository.findUserByLogin(loginOrEmail);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (user.password === password) {
      return user;
    }
    return false;
  }
}
