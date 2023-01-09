import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session, SessionDocument } from './domain/session.schema';
import { SessionType, UsersType } from '../../../types/types';

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
    const result = await this.SessionModel.findOne(
      {
        userId,
        lastActiveDate,
        title,
      },
      { _id: 0, __v: 0 },
    );
    return result;
  }

  async findCurrentSession2(userId: string, title: string) {
    const result = await this.SessionModel.findOne(
      {
        userId,
        title,
      },
      { _id: 0, __v: 0 },
    );
    return result;
  }

  async findAllUserSessions(userId: string) {
    return this.SessionModel.find(
      {
        userId,
      },
      { _id: 0, userId: 0, __v: 0 },
    ).lean();
  }

  async findSessionByItId(sessionId: string): Promise<SessionType> {
    return this.SessionModel.findOne(
      {
        deviceId: sessionId,
      },
      { _id: 0, __v: 0 },
    );
  }

  async userSessionsCount(userId: string) {
    const sessionsCount = await this.SessionModel.count({ userId });
    return sessionsCount;
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

  async deleteAllUserSessions(userId: string): Promise<boolean> {
    const result = await this.SessionModel.deleteMany({ userId });
    return true;
  }

  async deleteSessionById(sessionId: string): Promise<boolean> {
    debugger;
    const result = await this.SessionModel.deleteOne({
      deviceId: sessionId,
    });
    return result.deletedCount === 1;
  }

  async deleteAllTEntities(): Promise<boolean> {
    const result = await this.SessionModel.deleteMany({});
    return true;
  }
}
