import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
