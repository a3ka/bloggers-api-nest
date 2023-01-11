import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QueryRepo, QueryRepoDocument } from './queryRepo.schema';
import {
  RefreshTokensBL,
  refreshTokensBLDocument,
} from './refreshTokensBL.schema';
import { Attempt, AttemptDocument } from './attempts.schema';
import { AttemptType } from 'src/types/types';

@Injectable()
export class AttemptsRepository {
  constructor(
    // @InjectModel(QueryRepo.name)
    // private QueryRepoModel: Model<QueryRepoDocument>,
    @InjectModel(Attempt.name)
    private AttemptModel: Model<AttemptDocument>,
  ) {}

  async getLastAttempts(
    ip: string,
    url: string,
    limitTime: Date,
  ): Promise<number | undefined | null> {
    const countAttempts = await this.AttemptModel.countDocuments({
      userIP: ip,
      url,
      time: { $gt: limitTime },
    });
    return countAttempts;
  }

  async addAttempt(
    userIP: string,
    url: string,
    time: Date,
  ): Promise<AttemptType> {
    const result = this.AttemptModel.insertMany([{ userIP, url, time }]);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return result;
  }

  async deleteAllAttempts(): Promise<boolean> {
    const result = await this.AttemptModel.deleteMany({});
    return true;
  }
}
