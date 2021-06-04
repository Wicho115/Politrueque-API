import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/user.module';
import { ReportsResolver } from './reports.resolver';
import { ReportsService } from './reports.service';
import {Report, ReportSchema} from './model/report'
import { ArticlesModule } from 'src/articles/articles.module';
import { ArticlesService } from 'src/articles/articles.service';
import { Article, ArticleSchema } from 'src/articles/model/article';
import { NonVerifiedArticle, NonVerifiedArticleSchema } from 'src/articles/model/non-verified-article';
import { UploadService } from 'src/upload/upload.service';
import { CommentsService } from 'src/comments/comments.service';
import { Comment, CommentSchema } from 'src/comments/model/comment';

@Module({
  imports : [MongooseModule.forFeature([
        {name : Report.name, schema : ReportSchema},
        {name : Article.name, schema : ArticleSchema}, 
        {name : NonVerifiedArticle.name, schema : NonVerifiedArticleSchema},
        {name : Comment.name, schema : CommentSchema}
      ]),
      forwardRef(() => UserModule),
      forwardRef(() => ArticlesModule),
  ],
  providers: [ReportsResolver, ReportsService, ArticlesService, UploadService, CommentsService],
  exports: [ReportsService]
})
export class ReportsModule {}
