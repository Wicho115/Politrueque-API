import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import {MongooseModule} from '@nestjs/mongoose';
import { ReportsModule } from './reports/reports.module';
import {GraphQLModule} from '@nestjs/graphql';
import {graphqlUploadExpress } from 'graphql-upload'
import { join } from 'path';
import { ArticlesModule } from './articles/articles.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RedisCacheModule } from './cache/redis-cache.module';
import { SessionModule } from './session/session.module';

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
  SessionModule  ],
  controllers: [AppController],
  providers: []  
})
export class AppModule implements NestModule{
  configure(consumer : MiddlewareConsumer){
    consumer.apply(graphqlUploadExpress()).forRoutes('graphql')
  }
}
