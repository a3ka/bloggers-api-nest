import { MongoClient, WithId } from 'mongodb';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import {
  BloggersType,
  CommentType,
  LikesStatusType,
  RefreshTokensCollectionType,
  UsersEmailConfDataType,
  UsersType,
} from './ts-types';
import { PostType } from './ts-types';
import { AttemptType } from './ts-types';

// dotenv.config();

// const mongoUri = process.env.MongoURI || "mongodb+srv://alexk:123qweasd@cluster0.lapbhyv.mongodb.net/?retryWrites=true&w=majority"

const mongoUri = 'mongodb+srv://alexk:123qweasd@cluster0.lapbhyv.mongodb.net';

const dbName = 'socialNetwork';

export const client = new MongoClient(mongoUri);
const db = client.db('socialNetwork');

const bloggersSchema = new mongoose.Schema<BloggersType>({
  id: String,
  name: String,
  youtubeUrl: String,
});

const postsSchema = new mongoose.Schema<PostType>(
  {
    id: String,
    title: String,
    shortDescription: String,
    content: String,
    bloggerId: String,
    bloggerName: String,
    addedAt: Object, // new
    extendedLikesInfo: {
      likesCount: Number,
      dislikesCount: Number,
      myStatus: String,
      newestLikes: [
        {
          addedAt: Object,
          userId: String,
          login: String,
        },
      ],
    },
  },
  { _id: false },
);

const usersSchema = new mongoose.Schema<UsersType>({
  id: String,
  login: String,
  password: String,
  isConfirmed: Boolean,
  email: String,
});

const usersEmailConfDataSchema = new mongoose.Schema<UsersEmailConfDataType>({
  email: String,
  confirmationCode: String,
  expirationDate: Date,
  isConfirmed: Boolean,
});

const commentsSchema = new mongoose.Schema<CommentType>(
  {
    postId: String,
    id: String,
    content: String,
    userId: String,
    userLogin: String,
    addedAt: Object,
    likesInfo: {
      likesCount: Number,
      dislikesCount: Number,
      myStatus: String,
    },
  },
  { _id: false },
);

// export const bloggersCollection = db.collection<BloggersType>("blogs")
export const BloggersModel = mongoose.model('blogs', bloggersSchema);

// export const postCollection = db.collection<PostType>("posts")
export const PostsModel = mongoose.model('posts', postsSchema);

export const usersCollection = db.collection<UsersType>('users');
//export const UsersModel = mongoose.model('users', usersSchema);

// export const usersEmailConfDataCollection = db.collection<UsersEmailConfDataType>("usersEmailConfData")
export const usersEmailConfDataModel = mongoose.model(
  'usersEmailConfData',
  usersEmailConfDataSchema,
);

// export const commentsCollection = db.collection<CommentType>("comments")
export const CommentsModel = mongoose.model('comments', commentsSchema);

export const endpointsAttemptsTrysCollection =
  db.collection<AttemptType>('attempts');

export const refreshTokensBlackListCollection =
  db.collection<RefreshTokensCollectionType>('refreshTokensBL');

export const likesStatusCollection =
  db.collection<LikesStatusType>('likesStatus');

export async function runDb() {
  try {
    // Connect the client to the server
    await client.connect();
    // // Establish and verify connection
    // await client.db("socialNetwork").command({ping: 1});

    await mongoose.connect(mongoUri + '/' + dbName);

    console.log('Connected successfully to mongo server');
  } catch {
    console.log("Can't connect to DB");
    // Ensure that the client will close when you finish/error
    await client.connect();

    await mongoose.disconnect();
  }
}
