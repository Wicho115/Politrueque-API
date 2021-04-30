import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import {MongooseModule} from '@nestjs/mongoose';
import { ReportsModule } from './reports/reports.module';
import {GraphQLModule} from '@nestjs/graphql';
import {graphqlUploadExpress } from 'graphql-upload'
import { join } from 'path';
import { ArticlesResolver } from './articles/articles.resolver';
import { ArticlesService } from './articles/articles.service';
import { ArticlesModule } from './articles/articles.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    
  MongooseModule.forRoot('mongodb://localhost/politrueque-api',{
    useNewUrlParser : true,
    useFindAndModify : false
  }),  

  GraphQLModule.forRoot({    
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
  UserModule],
  controllers: [AppController],
  providers: [ArticlesResolver, ArticlesService]  
})
export class AppModule implements NestModule{
  configure(consumer : MiddlewareConsumer){
    consumer.apply(graphqlUploadExpress()).forRoutes('graphql')
  }
}
