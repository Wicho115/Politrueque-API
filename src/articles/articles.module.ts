import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesResolver } from './articles.resolver';
import {MongooseModule} from '@nestjs/mongoose'
import {Article, ArticleSchema} from './model/article'

@Module({
  imports : [
    MongooseModule.forFeature([{name : Article.name, schema : ArticleSchema}])
  ],
  providers: [ArticlesService, ArticlesResolver],
  exports : [ArticlesService]
})
export class ArticlesModule {}
