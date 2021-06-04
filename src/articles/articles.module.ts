import { forwardRef, Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesResolver } from './articles.resolver';
import {MongooseModule} from '@nestjs/mongoose'
import {Article, ArticleSchema} from './model/article'
import {NonVerifiedArticle, NonVerifiedArticleSchema} from './model/non-verified-article'
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { NVArticlesResolver } from './nv-articles.resolver';
import { ReportsModule } from 'src/reports/reports.module';
import { UploadModule } from 'src/upload/upload.module';
import { CommentsModule } from '../comments/comments.module';
import { UserService } from 'src/user/user.service';
import { User, UserSchema } from 'src/user/model/user';
import { Admin, AdminSchema } from 'src/user/model/admin';

@Module({
  imports : [
    MongooseModule.forFeature([
      {name : Article.name, schema : ArticleSchema}, 
      {name : NonVerifiedArticle.name, schema : NonVerifiedArticleSchema},
      {name: User.name, schema:UserSchema}, 
      {name : Admin.name, schema : AdminSchema}]),
    AuthModule,
    UploadModule,
    CommentsModule,
    forwardRef(() => UserModule),
    forwardRef(() => ReportsModule),  
  ],
  providers: [ArticlesService, ArticlesResolver, NVArticlesResolver, UserService],
  exports : [ArticlesService]
})
export class ArticlesModule {}
