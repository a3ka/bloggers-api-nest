import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BloggersController } from './bloggers/bloggers.controller';
import { BloggersService } from './bloggers/bloggers.service';
import { BloggersRepository } from './bloggers/bloggers.repository';

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
