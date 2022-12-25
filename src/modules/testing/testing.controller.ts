import { Controller, Delete, HttpCode } from '@nestjs/common';
import { BlogsRepository } from '../blogs/infrastructure DAL/blogs.repository';
import { PostsRepository } from '../posts/infrastructure (DAL)/posts.repository';
import { UsersRepository } from '../users/infrastructure (DAL)/users.repository';

@Controller('testing')
export class TestingController {
  constructor(
    protected blogsRepository: BlogsRepository,
    protected postsRepository: PostsRepository,
    protected usersRepository: UsersRepository,
  ) {}

  @HttpCode(204)
  @Delete('/all-data')
  async deleteUser() {
    await this.postsRepository.deleteAllPosts();
    await this.usersRepository.deleteAllUsers();
    await this.blogsRepository.deleteAllBlogs();
    // await commentsRepository.deleteAllComments();
    // await attemptsRepository.deleteAllAttempts();
    // await refreshTokensBLRepository.deleteAllTokensInBlackList();
  }
}
