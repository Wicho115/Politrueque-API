import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as firebase from 'firebase-admin';
const path = require('path');

const port = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors : true});  
  app.use(cookieParser());

  firebase.initializeApp({
    credential : firebase.credential.cert(path.join(__dirname, '../src/auth/politrueque-firebase.json')),
    storageBucket : "politrueque.appspot.com/",
  });
  
  await app.listen(port);
  console.log(`Running on port ${port}`);  
  
}
bootstrap();
