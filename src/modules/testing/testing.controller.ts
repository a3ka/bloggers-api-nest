import { Controller, Delete, HttpCode } from '@nestjs/common';
import { BlogsRepository } from '../blogs/infrastructure DAL/blogs.repository';
import { PostsRepository } from '../posts/infrastructure (DAL)/posts.repository';
import { UsersRepository } from '../users/infrastructure (DAL)/users.repository';
import { CommentsRepository } from '../comments/infrastructure (DAL)/comments.repository';
import { QueryRepository } from '../../queryRepository/query.repository';
import { SecurityRepository } from '../security-devices/infrastructure (DAL)/security.repository';
import { AttemptsRepository } from '../../queryRepository/attemps.repository.';

@Controller('testing')
export class TestingController {
  constructor(
    protected blogsRepository: BlogsRepository,
    protected postsRepository: PostsRepository,
    protected usersRepository: UsersRepository,
    protected commentsRepository: CommentsRepository,
    protected queryRepository: QueryRepository,
    protected securityRepository: SecurityRepository,
    protected attemptsRepository: AttemptsRepository,
  ) {}

  @HttpCode(204)
  @Delete('/all-data')
  async deleteUser() {
    await this.postsRepository.deleteAllPosts();
    await this.usersRepository.deleteAllUsers();
    await this.blogsRepository.deleteAllBlogs();
    await this.commentsRepository.deleteAllComments();
    await this.queryRepository.deleteAllTokensInBlackList();
    await this.securityRepository.deleteAllTEntities();
    await this.attemptsRepository.deleteAllAttempts();
  }
}
