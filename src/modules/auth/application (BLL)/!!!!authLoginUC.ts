import { UsersRepository } from 'src/modules/users/infrastructure (DAL)/users.repository';
import { Injectable } from '@nestjs/common';
import { UsersType } from '../../../types/types';
// import { JwtService } from './!!!!jwt.service';

@Injectable()
export class AuthLoginUC {
  // constructor(
  //   protected usersRepository: UsersRepository,
  //   protected jwtService: JwtService,
  // ) {}
  //
  // async _authLogin(
  //   loginOrEmail: string,
  //   password: string,
  // ): Promise<boolean | UsersType> {
  //   const user = await this.usersRepository.findUserByLoginOrEmail(
  //     loginOrEmail,
  //   );
  //   if (!user) return false;
  //   const passwordHash = await this.jwtService.generateHash(
  //     password,
  //     user.passwordSalt,
  //   );
  //   if (user.passwordHash !== passwordHash) {
  //     return false;
  //   }
  //   return user;
  // }
}
