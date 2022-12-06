import { Controller, Delete, HttpCode } from '@nestjs/common';
import { BlogsRepository } from '../blogs/infrastructure DAL/blogs.repository';
import { PostsRepository } from '../posts/infrastructure (DAL)/posts.repository';

@Controller('testing')
export class TestingController {
  constructor(
    protected blogsRepository: BlogsRepository,
    protected postsRepository: PostsRepository,
  ) {}

  @HttpCode(204)
  @Delete('/all-data')
  async deleteUser() {
    await this.postsRepository.deleteAllPosts();
    // await usersRepository.deleteAllUsers();
    await this.blogsRepository.deleteAllBlogs();
    // await commentsRepository.deleteAllComments();
    // await attemptsRepository.deleteAllAttempts();
    // await refreshTokensBLRepository.deleteAllTokensInBlackList();
  }
}
