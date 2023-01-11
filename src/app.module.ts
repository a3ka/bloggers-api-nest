import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogsController } from './modules/blogs/api/blogs.controller';
import { BlogsService } from './modules/blogs/application BLL/blogs.service';
import { BlogsRepository } from './modules/blogs/infrastructure DAL/blogs.repository';
import { PostsService } from './modules/posts/application (BLL)/posts.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Blog,
  BlogSchema,
} from './modules/blogs/infrastructure DAL/domain/blog.schema';
import { PostsController } from './modules/posts/api/posts.controller';
import {
  Post,
  PostsSchema,
} from './modules/posts/infrastructure (DAL)/domain/posts.schema';
import { PostsRepository } from './modules/posts/infrastructure (DAL)/posts.repository';
import { TestingController } from './modules/testing/testing.controller';
import { UsersController } from './modules/users/api/users.controller';
import { UsersService } from './modules/users/application (BLL)/users.service';
import { UsersRepository } from './modules/users/infrastructure (DAL)/users.repository';
import {
  User,
  UsersSchema,
  UsersUnconfirmedSchema,
  UserUnconfirmed,
} from './modules/users/infrastructure (DAL)/domain/users.schema';
import { AuthController } from './modules/auth/api/auth.controller';
import {
  Auth,
  AuthSchema,
} from './modules/auth/infrastructure (DAL)/domain/auth.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { LocalStrategy } from './modules/auth/api/strategies/local.strategy';
import { JwtStrategy } from './modules/auth/api/strategies/jwt.strategy';
import { GenerateHash } from './modules/common-services/generate-hash';
import { BasicStrategy } from './modules/auth/api/strategies/basic.strategy';
import { AuthService } from './modules/auth/application (BLL)/auth.service';
import {
  Comment,
  CommentSchema,
} from './modules/comments/infrastructure (DAL)/domain/comment.schema';
import { CommentsController } from './modules/comments/api/comments.controller';
import { CommentsService } from './modules/comments/application (BLL)/comments.service';
import { CommentsRepository } from './modules/comments/infrastructure (DAL)/comments.repository';
import { MailModule } from './modules/common-services/mail/mail.module';
import { MailService } from './modules/common-services/mail/mail.service';
import {
  RefreshTokensBL,
  refreshTokensBLSchema,
} from './queryRepository/refreshTokensBL.schema';
import { QueryRepository } from './queryRepository/query.repository';
import { ConfigModule } from '@nestjs/config';
import {
  Session,
  SessionSchema,
} from './modules/security-devices/infrastructure (DAL)/domain/session.schema';
import { SecurityController } from './modules/security-devices/api/security.controller';
import { SecurityService } from './modules/security-devices/application (BLL)/security.service';
import { SecurityRepository } from './modules/security-devices/infrastructure (DAL)/security.repository';
import { CheckLimitsIPAttemptsMiddleware } from './middleware/checkLimitsIPAttempts.middleware';
import { Attempt, AttemptSchema } from './queryRepository/attempts.schema';
import { AttemptsRepository } from './queryRepository/attemps.repository.';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      'mongodb+srv://alexk:123qweasd@cluster0.lapbhyv.mongodb.net/socialNetwork',
    ),
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostsSchema },
      { name: User.name, schema: UsersSchema },
      { name: UserUnconfirmed.name, schema: UsersUnconfirmedSchema },
      { name: Auth.name, schema: AuthSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: RefreshTokensBL.name, schema: refreshTokensBLSchema },
      { name: Session.name, schema: SessionSchema },
      { name: Attempt.name, schema: AttemptSchema },
    ]),
    PassportModule,
    // JwtModule.register({
    //   // secret: process.env.JWT_SECRET || '123',
    //   // signOptions: { expiresIn: '5m' },
    // }),
    MailModule,
  ],
  controllers: [
    AppController,
    BlogsController,
    PostsController,
    TestingController,
    UsersController,
    AuthController,
    CommentsController,
    SecurityController,
  ],
  providers: [
    AppService,
    BlogsService,
    BlogsRepository,
    PostsService,
    PostsRepository,
    UsersService,
    UsersRepository,
    CommentsService,
    CommentsRepository,
    QueryRepository,
    AuthService,
    GenerateHash,
    LocalStrategy,
    JwtStrategy,
    JwtService,
    BasicStrategy,
    // JwtCookiesStrategy,
    MailService,
    SecurityService,
    SecurityRepository,
    AttemptsRepository,
  ],
})
// export class AppModule {}
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckLimitsIPAttemptsMiddleware)
      .forRoutes({ path: 'auth', method: RequestMethod.POST });
  }
}
