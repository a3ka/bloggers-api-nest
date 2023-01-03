import { UsersRepository } from '../infrastructure (DAL)/users.repository';
import { UserDBType, UsersExtendedType, UsersType } from '../../../types/types';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { GenerateHash } from '../../common-services/generate-hash';

@Injectable()
export class UsersService {
  constructor(
    protected usersRepository: UsersRepository,
    // protected jwtService: JwtService,
    protected hashGenerator: GenerateHash,
  ) {}

  async getAllUsers(
    pageNumber: string = '1' || undefined,
    pageSize: string = '10' || undefined,
    sortBy = 'createdAt',
    sortDirection = 'desc',
    searchLoginTerm: string | null = null,
    searchEmailTerm: string | null = null,
  ): Promise<UsersExtendedType | undefined | null> {
    return this.usersRepository.getAllUsers(
      +pageNumber,
      +pageSize,
      sortBy,
      sortDirection,
      searchLoginTerm,
      searchEmailTerm,
    );
  }

  async createUser(
    login: string,
    password: string,
    email: string,
  ): Promise<UsersType> {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this.hashGenerator._generateHash(
      password,
      passwordSalt,
    );

    const newUser = {
      id: uuidv4(),
      login,
      email,
      passwordHash,
      passwordSalt,
      createdAt: new Date().toString(),
      // createdAt: new Date().toString(),
      // isConfirmed: false,
    };
    return this.usersRepository.createUser(newUser);
  }

  // async _generateHash(password: string, salt: string) {
  //   const hash = bcrypt.hash(password, salt);
  //   return hash;
  // }

  async deleteUser(id: string): Promise<boolean> {
    return this.usersRepository.deleteUser(id);
  }

  // async findUserById(userId: string): Promise<UsersType | undefined | null> {
  //   return this.usersRepository.findUserById(userId);
  // }
}
