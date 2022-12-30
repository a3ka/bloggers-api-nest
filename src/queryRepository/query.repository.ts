import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QueryRepo, QueryRepoDocument } from './queryRepo.schema';
import {
  RefreshTokensBL,
  refreshTokensBLDocument,
} from './refreshTokensBL.schema';

@Injectable()
export class QueryRepository {
  constructor(
    // @InjectModel(QueryRepo.name)
    // private QueryRepoModel: Model<QueryRepoDocument>,
    @InjectModel(RefreshTokensBL.name)
    private RefreshTokensBLModel: Model<refreshTokensBLDocument>,
  ) {}

  async checkRFTokenInBlacklist(code: string): Promise<boolean> {
    debugger;
    const result = await this.RefreshTokensBLModel.findOne(
      { refreshToken: code },
      { _id: 0, __v: 0 },
    );
    if (result) return true;
    return false;
  }

  async addRFTokenInBlacklist(rfToken: string): Promise<boolean> {
    debugger;
    const result = await this.RefreshTokensBLModel.insertMany([
      { refreshToken: rfToken },
    ]);
    if (result) return true;
    return false;
  }

  async deleteAllTokensInBlackList(): Promise<boolean> {
    const result = await this.RefreshTokensBLModel.deleteMany({});
    return true;
  }
}
