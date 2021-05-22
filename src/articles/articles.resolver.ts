import { Resolver, Mutation, Query, Args, ResolveField, Parent, Int } from '@nestjs/graphql';
import { ArticlesService } from './articles.service';
import { Article } from './model/article'
import { NonVerifiedArticle } from './model/non-verified-article';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { UserService } from 'src/user/user.service';
import { BadRequestException, UnauthorizedException, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/user/model/user';
import { UpdateArticleInput } from './article.inputs';
import { handleMongoError } from 'src/utils/error.util';
import { Privileges } from 'src/user/interface/privileges.interface';

@Resolver(() => Article)
export class ArticlesResolver {
    constructor(
        private readonly articleService: ArticlesService,
        private readonly userService: UserService,
    ) { }

    @Query(() => [Article])
    @UseGuards(GqlAuthGuard)
    public async getArticles(
        @Args('action_id', { type: () => Int }) action_id: number,
    ): Promise<Article[] | void> {
        if (action_id < 1 || action_id > 3) throw new BadRequestException("No such action_id");
        return await this.articleService.getArticles(action_id).catch((e) => {
            handleMongoError(e);
        });
    }

    @Query(() => Article)
    @UseGuards(GqlAuthGuard)
    public async getArticle(
        @Args('id', { type: () => String }) id: string
    ): Promise<Article | void> {
        return await this.articleService.getArticle(id).catch((e) => {
            handleMongoError(e);
        });;
    }

    @Mutation(() => Article)
    @UseGuards(GqlAuthGuard)
    public async updateArticle(
        @Args('payload') payload : UpdateArticleInput,
        @CurrentUser() user : User,
    ): Promise<Article>{
        const article = await this.articleService.getArticle(payload.id);
        if(!article) throw new BadRequestException("No article found")
        if(article.propietary_id != user._id) throw new UnauthorizedException("Access denied");
        return await this.articleService.updateArticle(payload.id, payload);
    }

    @Mutation(() => Article)
    @UseGuards(GqlAuthGuard)
    public async deleteArticle(
        @Args('id', {type : () => String}) id : string,
        @CurrentUser() user : User,
    ):Promise<Article>{
        const article = await this.articleService.getArticle(id);
        if(!article) throw new BadRequestException("No such article");
        if(article.propietary_id != user._id) {
            const admin = await this.userService.getAdminByID(user._id)
            if(!admin) throw new UnauthorizedException("Access denied");
            const privileges = admin.privileges as Privileges;
            if(!privileges.canDeleteArticles) 
            throw new UnauthorizedException("You don't have enough privileges");            
        }
        return await this.articleService.deleteArticle(id);
    }    

    @ResolveField(() => User)
    async propietary(@Parent() Article: NonVerifiedArticle) {
        const { propietary_id } = Article;
        return await this.userService.searchUserByID(propietary_id);
    }
}
