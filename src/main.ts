import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';

async function bootstrap(): Promise<void> {
  const app: INestApplication = await NestFactory.create(AppModule);
  const port = process.env.PORT || 80;
  await app.listen(port);
  console.log(`Application is running on port ${port}`);
}

bootstrap().catch((error: Error) => {
  console.error('Error starting application:', error);
  process.exit(1);
});