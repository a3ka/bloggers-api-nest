import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class GenerateHash {
  async _generateHash(password: string, salt: string) {
    const hash = bcrypt.hash(password, salt);
    return hash;
  }
}
