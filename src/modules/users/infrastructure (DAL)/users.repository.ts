import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './domain/users.schema';
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

    const users = await this.UsersModel.find(
      {},
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

  async createUser(newUser: UserDBType): Promise<UserDBType> {
    await this.UsersModel.insertMany([newUser]);
    // await this.UsersModel.insertOne(newUser)
    const user = await this.UsersModel.findOne(
      { id: newUser.id },
      { _id: 0, password: 0, email: 0, isConfirmed: 0, __v: 0 },
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return user;
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await this.UsersModel.deleteOne({ id: id });
    return result.deletedCount === 1;
  }

  //----------------------------------------------------------------------

  async findUserByLogin(loginOrEmail: string): Promise<UsersType | false> {
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
    return user;
  }
}

//
//
//
// async findUserById(userId: string): Promise<UsersType> {
//   const user = await UsersModel.findOne(
//     { id: userId },
//     { _id: 0, password: 0, email: 0, isConfirmed: 0, __v: 0 },
//   );
//   // @ts-ignore
//   return user;
// }
//
// async findUserWithEmailById(userId: string): Promise<UsersWithEmailType> {
//   const user = await UsersModel.findOne(
//     { id: userId },
//     { _id: 0, password: 0, isConfirmed: 0, __v: 0 },
//   );
//   // @ts-ignore
//   return user;
// }
//
// async findUserByEmail(email: string) {
//   const user = await UsersModel.findOne({ email }, { _id: 0, password: 0 });
//
//   return user;
// }
//
// async findUserByConfirmCode(confirmationCode: string) {
//   const emailData = await usersEmailConfDataModel.findOne(
//     { confirmationCode: confirmationCode },
//     { projection: { _id: 0 } },
//   );
//
//   const accountData = await UsersModel.findOne(
//     { email: emailData?.email },
//     { projection: { _id: 0 } },
//   );
//
//   if (emailData === null && accountData === null) {
//     const user = {
//       accountData: undefined,
//       emailConfirmation: undefined,
//     };
//     return user;
//   } else {
//     const user = {
//       accountData,
//       emailConfirmation: emailData,
//     };
//     return user;
//   }
// }
//
// async insertToDbUnconfirmedEmail(
//   newUserEmail: UsersEmailConfDataType,
// ): Promise<boolean> {
//   const result = await usersEmailConfDataModel.insertMany([newUserEmail]);
//   // return result.acknowledged  ;
//   if (result) {
//     return true;
//   } else {
//     return false;
//   }
// }
//
// async updateUnconfirmedEmailData(
//   updatedEmailConfirmationData: UsersEmailConfDataType,
// ): Promise<boolean> {
//   const result = await usersEmailConfDataModel.updateOne(
//     { email: updatedEmailConfirmationData.email },
//     {
//       $set: {
//         confirmationCode: updatedEmailConfirmationData.confirmationCode,
//         expirationDate: updatedEmailConfirmationData.expirationDate,
//       },
//     },
//   );
//
//   return result.acknowledged;
// }
//
// async deleteUserUnconfirmedEmail(email: string): Promise<boolean> {
//   const result = await usersEmailConfDataModel.deleteOne({ email });
//   return result.deletedCount === 1;
// }
//
// async updateEmailConfirmation(email: string): Promise<UsersType | null> {
//   const accountDataRes = await UsersModel.updateOne(
//     { email },
//     { $set: { isConfirmed: true } },
//   );
//
//   if (!accountDataRes) {
//     return null;
//   } else {
//     await usersEmailConfDataModel.deleteOne({ email });
//     const result = await UsersModel.findOne(
//       { email },
//       { projection: { _id: 0, password: 0, email: 0, isConfirmed: 0 } },
//     );
//     return result;
//   }
// }
//
// async deleteAllUsers(): Promise<boolean> {
//   await UsersModel.deleteMany({});
//   await usersEmailConfDataModel.deleteMany({});
//   return true;
// }
//
//
