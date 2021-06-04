import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ArticlesService } from 'src/articles/articles.service';
import { User } from 'src/user/model/user';
import { CreateCommentInput } from './comments.inputs';
import { Comment, CommentDocument } from './model/comment';

@Injectable()
export class CommentsService {
    constructor(
        @InjectModel(Comment.name)
        private readonly commentModel : Model<CommentDocument>,
    ){}

    public async CreateComment(data : CreateCommentInput, {_id} : User) : Promise<Comment>{        
        const comment = new this.commentModel(data)
        comment.author_id = _id;
        return await comment.save();
    }

    public async getCommentsByArticleID(_id : string) : Promise<Comment[]>{
        return await this.commentModel.find({NVArticle_id : _id})
    }

    public async deleteCommentByID(id : string, {_id} : User) : Promise<Comment>{
        const comment = await this.commentModel.findById(id);                
        if(comment.author_id != _id) throw new UnauthorizedException("You are not the owner of this comment")
        return await this.commentModel.findByIdAndDelete(id);
    }

    public async deleteAllComments(NVArticle_id : string){
        const comments = await this.commentModel.find({NVArticle_id});
        for (let i = 0; i < comments.length; i++) {
            const comment = await this.commentModel.findByIdAndDelete(comments[i]._id)     
            console.log(`Se ha eliminado el comentario: ${comment._id}`);
        }
        return "Se han eliminado todos los comentarios satisfactoriamente";
    }
}
