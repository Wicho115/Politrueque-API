import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CurrentAdminUser } from 'src/auth/decorators/current-adminuser.decorator';
import { AdminAuthGuard } from 'src/auth/guards/admin-auth.guard';
import { User } from 'src/user/model/user';
import { UserService } from 'src/user/user.service';
import { CreateCommentInput } from './comments.inputs';
import { CommentsService } from './comments.service';
import { Comment } from './model/comment';

@Resolver(() => Comment)
export class CommentsResolver {
    constructor(
        private readonly commentService : CommentsService,
        private readonly userService :  UserService,
    ){}

    @Mutation(() => Comment)
    @UseGuards(AdminAuthGuard)
    public async createComment(
        @Args('payload') payload : CreateCommentInput,
        @CurrentAdminUser() user : User,
    ){
        return await this.commentService.CreateComment(payload, user);
    }

    @Mutation(() => Comment)
    @UseGuards(AdminAuthGuard)
    public async deleteComment(
        @Args('id') id : string,
        @CurrentAdminUser() user : User,
    ){        
        return await this.commentService.deleteCommentByID(id, user);
    }

    @ResolveField(() => User)
    public async Author(@Parent() {author_id} : Comment){
        return await this.userService.searchUserByID(author_id);
    }
}
