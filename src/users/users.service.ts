import { UsersExtendedType, UsersType } from '../types/types';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(protected usersRepository: UsersRepository) {}

  async getAllUsers(
    pageNumber: string = '1' || undefined,
    pageSize: string = '10' || undefined,
  ): Promise<UsersExtendedType | undefined | null> {
    return this.usersRepository.getAllUsers(+pageNumber, +pageSize);
  }

  async createUser(
    login: string,
    password: string,
    email: string,
  ): Promise<UsersType> {
    const newUser = {
      id: (+new Date()).toString(),
      login,
      email,
      password,
      isConfirmed: false,
    };
    return this.usersRepository.createUser(newUser);
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.usersRepository.deleteUser(id);
  }
}
