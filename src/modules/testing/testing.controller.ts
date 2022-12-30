import { Controller, Delete, HttpCode } from '@nestjs/common';
import { BlogsRepository } from '../blogs/infrastructure DAL/blogs.repository';
import { PostsRepository } from '../posts/infrastructure (DAL)/posts.repository';
import { UsersRepository } from '../users/infrastructure (DAL)/users.repository';
import { CommentsRepository } from '../comments/infrastructure (DAL)/comments.repository';
import { QueryRepository } from '../../queryRepository/query.repository';

@Controller('testing')
export class TestingController {
  constructor(
    protected blogsRepository: BlogsRepository,
    protected postsRepository: PostsRepository,
    protected usersRepository: UsersRepository,
    protected commentsRepository: CommentsRepository,
    protected queryRepository: QueryRepository,
  ) {}

  @HttpCode(204)
  @Delete('/all-data')
  async deleteUser() {
    await this.postsRepository.deleteAllPosts();
    await this.usersRepository.deleteAllUsers();
    await this.blogsRepository.deleteAllBlogs();
    await this.commentsRepository.deleteAllComments();
    await this.queryRepository.deleteAllTokensInBlackList();
  }
}
