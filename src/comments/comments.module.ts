import { Module, forwardRef } from '@nestjs/common';
import {ArticlesModule} from '../articles/articles.module'
import {CommentsService} from './comments.service';
import {CommentsResolver} from './comments.resolver';
import {MongooseModule} from '@nestjs/mongoose';
import {Comment, CommentSchema} from './model/comment';
import { UserModule } from 'src/user/user.module';


@Module({
    imports : [        
        MongooseModule.forFeature([{name : Comment.name, schema : CommentSchema}]),
        forwardRef(()=>UserModule)
    ],
    providers : [CommentsResolver, CommentsService],
    exports : [CommentsService]
})
export class CommentsModule {}


