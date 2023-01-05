import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session, SessionDocument } from './domain/session.schema';
import { UsersType } from '../../../types/types';

@Injectable()
export class SecurityRepository {
  constructor(
    @InjectModel(Session.name) private SessionModel: Model<SessionDocument>,
  ) {}

  async findCurrentSession(
    userId: string,
    lastActiveDate: string,
    title: string,
  ) {
    return this.SessionModel.findOne(
      {
        userId,
        lastActiveDate,
        title,
      },
      { _id: 0, userId: 0, __v: 0 },
    );
  }

  async createNewSession(newSession: any): Promise<boolean> {
    await this.SessionModel.insertMany([newSession]);
    return true;
  }

  async updateSession(
    userId: string,
    ip: string,
    title: string,
    lastActiveDate: string,
  ): Promise<boolean> {
    const result = await this.SessionModel.updateOne(
      { userId, title },
      {
        $set: {
          lastActiveDate,
          ip,
        },
      },
    );
    return result.matchedCount === 1;
  }
}
