import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { runDb } from './db';

async function bootstrap() {
  await runDb();
  const app = await NestFactory.create(AppModule);
  await app.listen(5000);
}
bootstrap();
