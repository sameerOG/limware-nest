import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule);
  dotenv.config();
  const port: number = parseInt(process.env.SERVER_PORT);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors();
  app.use(cookieParser());

  await app.listen(port, () => {
    console.log("[API UP]", port);
  });
}
bootstrap();
