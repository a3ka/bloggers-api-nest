import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  User,
  UserDocument,
  UserUnconfirmed,
  UserUnconfirmedDocument,
} from './domain/users.schema';
import {
  PostsExtendedType,
  PostType,
  UserDBType,
  UsersExtendedType,
  UsersType,
} from '../../../types/types';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private UsersModel: Model<UserDocument>,
    @InjectModel(UserUnconfirmed.name)
    private UsersUnconfirmedModel: Model<UserUnconfirmedDocument>,
  ) {}

  async getAllUsers(
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: string,
    searchLoginTerm: string | null,
    searchEmailTerm: string | null,
  ): Promise<UsersExtendedType | undefined | null> {
    let sortDirect;
    if (sortDirection === 'desc') {
      sortDirect = 1;
    } else {
      sortDirect = -1;
    }

    if (searchLoginTerm) {
      const users = await this.UsersModel.find(
        { searchLoginTerm: searchLoginTerm },
        // { name: { $regex: searchLoginTerm } },
        { _id: 0, password: 0, email: 0, isConfirmed: 0, __v: 0 },
      )
        .sort({ sortBy: sortDirect })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .lean();

      const usersCount = await this.UsersModel.count({});
      const pagesCount = Math.ceil(usersCount / pageSize);

      const result = {
        pagesCount,
        page: pageNumber,
        pageSize,
        totalCount: usersCount,
        items: users,
      };

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return result;
    }

    if (searchEmailTerm) {
      const users = await this.UsersModel.find(
        { searchLoginTerm: searchEmailTerm },
        // { name: { $regex: searchLoginTerm } },
        { _id: 0, passwordHash: 0, passwordSalt: 0, isConfirmed: 0, __v: 0 },
      )
        .sort({ sortBy: sortDirect })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .lean();

      const usersCount = await this.UsersModel.count({});
      const pagesCount = Math.ceil(usersCount / pageSize);

      const result = {
        pagesCount,
        page: pageNumber,
        pageSize,
        totalCount: usersCount,
        items: users,
      };

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return result;
    }

    const users = await this.UsersModel.find(
      {},
      { _id: 0, passwordHash: 0, passwordSalt: 0, isConfirmed: 0, __v: 0 },
    )
      .sort({ sortBy: sortDirect })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean();

    const usersCount = await this.UsersModel.count({});
    const pagesCount = Math.ceil(usersCount / pageSize);

    const result = {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount: usersCount,
      items: users,
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return result;
  }

  async createUser(newUser: UsersType): Promise<UsersType> {
    await this.UsersModel.insertMany([newUser]);
    // await this.UsersModel.insertOne(newUser)
    const user = await this.UsersModel.findOne(
      { id: newUser.id },
      { _id: 0, passwordHash: 0, passwordSalt: 0, isConfirmed: 0, __v: 0 },
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return user;
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await this.UsersModel.deleteOne({ id: id });
    return result.deletedCount === 1;
  }

  async deleteAllUsers(): Promise<boolean> {
    const result = await this.UsersModel.deleteMany({});
    return true;
  }

  async findUserByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<UsersType | false> {
    const user = await this.UsersModel.findOne(
      {
        $or: [
          {
            login: loginOrEmail,
          },
          {
            email: loginOrEmail,
          },
        ],
      },
      { _id: 0, email: 0, __v: 0 },
      // { _id: 0, email: 0, isConfirmed: 0, __v: 0 },
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return user;
  }

  async findUserById(userId: string): Promise<UsersType> {
    const user = await this.UsersModel.findOne(
      { id: userId },
      {
        _id: 0,
        passwordHash: 0,
        passwordSalt: 0,
        createdAt: 0,
        isConfirmed: 0,
        __v: 0,
      },
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return user;
  }

  async createUnconfirmedUser(newUser: UserDBType): Promise<boolean> {
    const result = await this.UsersUnconfirmedModel.insertMany([newUser]);
    if (result) {
      return true;
    } else {
      return false;
    }
  }

  async findUnconfirmedUserByCode(
    confirmationCode: string,
  ): Promise<UserDBType> {
    return this.UsersUnconfirmedModel.findOne(
      { 'emailConfirmation.confirmationCode': confirmationCode },
      { _id: 0, __v: 0 },
    );
  }

  async deleteUnconfirmedUser(email: string): Promise<boolean> {
    const result = await this.UsersUnconfirmedModel.deleteOne({
      'accountData.email': email,
    });
    return result.deletedCount === 1;
  }

  async findUnconfirmedUserByEmail(email: string): Promise<UserDBType> {
    return this.UsersUnconfirmedModel.findOne(
      { 'accountData.email': email },
      { _id: 0, __v: 0 },
    );
  }

  async updateUnconfirmedUser(
    id: string,
    code: string,
    expirationDate: Date,
  ): Promise<boolean> {
    const result = await this.UsersUnconfirmedModel.updateOne(
      { id },
      {
        $set: {
          'emailConfirmation.confirmationCode': code,
          'emailConfirmation.expirationDate': expirationDate,
        },
      },
    );
    return result.matchedCount === 1;
  }
}
