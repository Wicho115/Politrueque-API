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

@Module({
  imports : [
    MongooseModule.forFeature([
      {name : Article.name, schema : ArticleSchema}, 
      {name : NonVerifiedArticle.name, schema : NonVerifiedArticleSchema}]),
    forwardRef(() => UserModule),
    forwardRef(() => ReportsModule),
    AuthModule,
  ],
  providers: [ArticlesService, ArticlesResolver, NVArticlesResolver],
  exports : [ArticlesService]
})
export class ArticlesModule {}
