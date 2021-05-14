import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

const port = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);  
  app.use(cookieParser());
  await app.listen(port);
  console.log(`Running on port ${port}`);  
  
}
bootstrap();
