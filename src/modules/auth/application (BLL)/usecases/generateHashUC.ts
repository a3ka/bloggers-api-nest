import { v4 as uuidv4 } from 'uuid';
import { UsersRepository } from 'src/modules/users/infrastructure (DAL)/users.repository';
import bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GenerateHash {
  // constructor(
  //   protected authRepository: AuthRepository,
  //   protected usersRepository: UsersRepository,
  // ) {}

  async _generateHash(password: string, salt: string) {
    const hash = bcrypt.hash(password, salt);
    return hash;
  }
}
