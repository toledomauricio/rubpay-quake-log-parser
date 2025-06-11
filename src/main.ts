import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';

async function bootstrap(): Promise<void> {
  const app: INestApplication = await NestFactory.create(AppModule);
  await app.listen(3000);
}

bootstrap().catch((error: Error) => {
  console.error('Error starting application:', error);
  process.exit(1);
});