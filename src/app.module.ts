import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import {MongooseModule} from '@nestjs/mongoose';
import {GraphQLModule} from '@nestjs/graphql';
import {graphqlUploadExpress } from 'graphql-upload'
import { join } from 'path';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RedisCacheModule } from './cache/redis-cache.module';
import { SessionModule } from './session/session.module';
import { ReportsModule } from './reports/reports.module';
import { UploadModule } from './upload/upload.module';
import { CommentsModule } from './comments/comments.module';
import { ArticlesModule } from './articles/articles.module';

@Module({
  imports: [
    
  MongooseModule.forRoot('mongodb://localhost/politrueque-api',{
    useNewUrlParser : true,
    useFindAndModify : false
  }),  

  GraphQLModule.forRoot({    
    context : ({res, req}) => ({res, req}),
    uploads : false,    
    installSubscriptionHandlers : true,
    autoSchemaFile : join(process.cwd() , "src" , "graphql" , "schema.gql"),    
    sortSchema: true,    
    debug : false,
    typePaths: ['./src/**/*.gql'],
    definitions:{    
      outputAs : 'class',
      path : join(process.cwd(), 'src' , 'graphql' , 'graphql.ts')
    }  
  }),

  ReportsModule,  
  ArticlesModule,
  UserModule,
  AuthModule,
  RedisCacheModule,
  SessionModule,
  UploadModule,
  CommentsModule  ],
  controllers: [AppController],
  providers: []  
})
export class AppModule implements NestModule{
  configure(consumer : MiddlewareConsumer){
    consumer.apply(graphqlUploadExpress()).forRoutes('graphql')
  }
}
