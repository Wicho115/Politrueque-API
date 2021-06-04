import { BadRequestException, UnauthorizedException, UseGuards } from "@nestjs/common";
import { Query, Resolver, Mutation, Args, ResolveField, Parent } from "@nestjs/graphql";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { GqlAuthGuard } from "src/auth/guards/gql-auth.guard";
import { User } from "src/user/model/user";
import { UserService } from "src/user/user.service";
import { handleMongoError } from "src/utils/error.util";
import { ActionInput, CreateArticleInput, UpdateNVArticleInput } from "./article.inputs";
import { ArticlesService } from "./articles.service";
import { Article } from "./model/article";
import { NonVerifiedArticle } from "./model/non-verified-article";
import { AdminAuthGuard } from "src/auth/guards/admin-auth.guard";
import { CurrentPrivileges } from "src/auth/decorators/current-privileges.decorator";
import { Privileges } from "src/user/interface/privileges.interface";
import { CommentsService } from "src/comments/comments.service";
import { Comment } from "src/comments/model/comment";

@Resolver(() => NonVerifiedArticle)
export class NVArticlesResolver{
    constructor(
        private readonly articleService : ArticlesService,
        private readonly userService : UserService,       
        private readonly commentService : CommentsService, 
    ){}

    @Query(() => [NonVerifiedArticle])
    @UseGuards(AdminAuthGuard)
    public async getNonVerifiedArticles() : Promise<NonVerifiedArticle[] | void>{
        return await this.articleService.getNonVerifiedArticles().catch((e) =>{
            handleMongoError(e);
        });
    }

    @Query(() => NonVerifiedArticle)
    @UseGuards(GqlAuthGuard)
    public async getNVArticle(
        @Args('id', {type : () => String} )id : string,
        @CurrentUser() user : User,
    ) : Promise<NonVerifiedArticle>{
        return await this.articleService.getMyNonVerifiedArticle(id, user);
    }

    @Query(() => [NonVerifiedArticle])
    @UseGuards(GqlAuthGuard)
    public async getMyNVArticles(
        @CurrentUser() user : User,
    ) : Promise<NonVerifiedArticle[] | void>{
        return await this.articleService.getMyNVArticles(user);
    }

    @Mutation(() => NonVerifiedArticle)
    @UseGuards(GqlAuthGuard)
    public async createArticle(
        @Args('payload') payload : CreateArticleInput, 
        @Args('action') action : ActionInput,
        @CurrentUser() user : User,
    ) : Promise<NonVerifiedArticle | void>{        
        return await this.articleService.createArticle(payload, action, user).catch((e) => {
            handleMongoError(e);
        });
    }

    @Mutation(() => NonVerifiedArticle)
    @UseGuards(GqlAuthGuard)
    public async deleteNVArticle(
        @Args('id' , {type : () => String}) id : string,
        @CurrentUser() user : User,  
    ){
        const article = await this.articleService.getNonVerifiedArticle(id);                  
        
        
        if(article.propietary_id != user._id){
            const admin = await this.userService.getAdminByID(user._id);
            if(!admin){
                throw new UnauthorizedException("Acces denied");
            }
            const privileges = admin.privileges as Privileges;
            if(!privileges.canDeleteArticles){
                throw new UnauthorizedException("You don't have enough privileges");
            }
        }    

        return await this.articleService.deleteNVArticle(id);
    }

    @Mutation(() => Article)
    @UseGuards(AdminAuthGuard)
    public async confirmArticle(        
        @CurrentPrivileges() privileges : Privileges,
        @Args('id', {type : () => String}) id : string,
    ){        
        if(!privileges.canAcceptArticles) throw new UnauthorizedException("You don't have enough privileges");
        
        return await this.articleService.verifyArticle(id).catch((e) => {
            handleMongoError(e);
        });
    }

    @Mutation(() => NonVerifiedArticle)
    @UseGuards(GqlAuthGuard)
    public async updateNVArticle(
        @CurrentUser() user : User,
        @Args('payload') payload : UpdateNVArticleInput,
    ){
        const article = await this.articleService.getNonVerifiedArticle(payload.id);
        if(!article){
            throw new BadRequestException("No such article");
        }
        if(article.propietary_id != user._id){
            throw new UnauthorizedException("Access denied");
        }

        return await this.articleService.edit_NVArticle(payload.id, payload);
    }
    

    @ResolveField(() => User)
    async Propietary(@Parent() Article : NonVerifiedArticle){
        const {propietary_id} = Article;
        return await this.userService.searchUserByID(propietary_id);
    }

    @ResolveField(() => [Comment], {nullable : true})
    public async Comments(@Parent() {_id} : NonVerifiedArticle){
        return await this.commentService.getCommentsByArticleID(_id);
    }
}