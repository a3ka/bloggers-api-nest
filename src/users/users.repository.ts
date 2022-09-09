import { Injectable } from '@nestjs/common';
import { UsersExtendedType, UsersType } from '../types/types';

@Injectable()
export class UsersRepository {
  async getAllUsers(
    pageNumber: number,
    pageSize: number,
  ): Promise<UsersExtendedType | undefined | null> {
    const users = await UsersModel.find(
      {},
      { _id: 0, password: 0, email: 0, isConfirmed: 0, __v: 0 },
    )
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean();

    const bloggersCount = await UsersModel.count({});
    const pagesCount = Math.ceil(bloggersCount / pageSize);

    const result = {
      pagesCount: pagesCount,
      page: pageNumber,
      pageSize,
      totalCount: bloggersCount,
      items: users,
    };

    return result;
  }

  async createUser(newUser: UsersType): Promise<UsersType> {
    await UsersModel.insertMany([newUser]);
    // await usersCollection.insertOne(newUser)
    const user = await UsersModel.findOne(
      { id: newUser.id },
      { _id: 0, password: 0, email: 0, isConfirmed: 0, __v: 0 },
    );

    return user;
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await UsersModel.deleteOne({ id: id });
    return result.deletedCount === 1;
  }

  async findUserByLogin(login: string): Promise<UsersType | boolean> {
    const user = await UsersModel.findOne(
      { login: login },
      { _id: 0, email: 0, isConfirmed: 0, __v: 0 },
    );

    if (user === null) return false;
    return user;
  }
}
