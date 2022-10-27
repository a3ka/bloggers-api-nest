import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BloggersController } from './modules/bloggers/bloggers.controller';
import { BloggersService } from './modules/bloggers/bloggers.service';
import { BloggersRepository } from './modules/bloggers/bloggers.repository';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController, BloggersController],
      providers: [AppService, BloggersService, BloggersRepository],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
