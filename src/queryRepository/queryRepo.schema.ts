import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type QueryRepoDocument = HydratedDocument<QueryRepo>;

@Schema()
export class QueryRepo {
  //
}

export const QueryRepoSchema = SchemaFactory.createForClass(QueryRepo);
