import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auth, AuthDocument } from './domain/auth.schema';

@Injectable()
export class AuthRepository {
  constructor(@InjectModel(Auth.name) private AuthModel: Model<AuthDocument>) {}
}
