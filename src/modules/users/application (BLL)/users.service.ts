import { UsersRepository } from '../infrastructure (DAL)/users.repository';
import { UsersExtendedType, UsersType } from '../../../types/types';
import { v4 as uuidv4 } from 'uuid';

export class UsersService {
  constructor(protected usersRepository: UsersRepository) {}

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
    const newUser = {
      id: uuidv4(),
      login,
      email,
      password,
      createdAt: (+new Date()).toString(),
      // isConfirmed: false,
    };
    return this.usersRepository.createUser(newUser);
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.usersRepository.deleteUser(id);
  }

  // async findUserById(userId: string): Promise<UsersType | undefined | null> {
  //   return this.usersRepository.findUserById(userId);
  // }
}
