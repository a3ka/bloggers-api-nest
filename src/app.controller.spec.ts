import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogsController } from './modules/blogs/api/blogs.controller';
import { BlogsService } from './modules/blogs/application BLL/blogs.service';
import { BloggersRepository } from './modules/blogs/infrastructure DAL/bloggers.repository';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController, BlogsController],
      providers: [AppService, BlogsService, BloggersRepository],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
