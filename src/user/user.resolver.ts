import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { UserService } from './user.service'
import { User } from './model/user'
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { UpdateUserInput, CreateUserInput, PrivilegesInput } from './user.inputs'
import { BadRequestException,  UnauthorizedException, UseGuards } from '@nestjs/common';
import { handleMongoError } from '../utils/error.util'
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { AdminAuthGuard } from 'src/auth/guards/admin-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Privileges } from './interface/privileges.interface'
import { CurrentPrivileges } from 'src/auth/decorators/current-privileges.decorator';
import { Article } from 'src/articles/model/article';
import { ArticlesService } from 'src/articles/articles.service';
import { Report } from 'src/reports/model/report';
import { ReportsService } from 'src/reports/reports.service';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { NonVerifiedArticle } from 'src/articles/model/non-verified-article';

@Resolver(() => User)
export class UserResolver {
    constructor(
        private readonly userService: UserService,
        private readonly articleService : ArticlesService,
        private readonly reportService : ReportsService,
    ) { }

    @Query(() => User)
    @UseGuards(GqlAuthGuard)
    public bye(@CurrentUser() user: User) {                
        return user;
    }

    @Query(() => User)
    @UseGuards(GqlAuthGuard)
    public async getUserByID(@Args('_id') id: string) {
        return await this.userService.searchUserByID(id);
    }

    @Mutation(() => User)
    @UseGuards(AdminAuthGuard)
    public async registerAdmin(
        @Args('payload') payload: CreateUserInput,
        @Args('privileges') privileges: PrivilegesInput,
        @CurrentPrivileges() AdminPrivileges: Privileges,
    ) {
        if (!AdminPrivileges.canRegisterAdmin) throw new UnauthorizedException("You don't have enough privileges")

        return await this.userService.createAdmin(payload, privileges).catch((e) => {
            throw handleMongoError(e);
        });
    }

    @Mutation(() => User)
    @UseGuards(AdminAuthGuard)
    public async createUser(
        @Args('payload') payload: CreateUserInput,
        @CurrentPrivileges() AdminPrivileges: Privileges,
    ) {
        if (!AdminPrivileges.canRegisterUser) throw new UnauthorizedException("You don't have enough privileges");

        return await this.userService.createUser(payload).catch((e) => {
            throw handleMongoError(e);
        });
    }

    @Mutation(() => User)
    @UseGuards(AdminAuthGuard)
    public async deleteUser(
        @Args('id', { type: () => String }) id: string,
        @CurrentPrivileges() AdminPrivileges: Privileges,
    ) {
        if (!AdminPrivileges.canDeleteUsers) throw new UnauthorizedException("You don't have enough privileges");

        const Admin = await this.userService.getAdminByID(id);

        if (Admin !== null) {
            if (!AdminPrivileges.canRegisterAdmin) {
                throw new UnauthorizedException("You don't have enough privileges");
            } else {
                await this.userService.deleteAdmin(id).catch((e) => {
                    throw handleMongoError(e);
                });
            }
        }

        return await this.userService.deleteUser(id).catch((e) => {
            throw handleMongoError(e);
        });
    }

    @Mutation(() => User)
    @UseGuards(GqlAuthGuard)
    public async updateUser(
        @CurrentUser() user : User,
        @Args('payload') payload : UpdateUserInput
    ){
        if(user._id != payload._id) throw new UnauthorizedException("You can't do that");
        return await this.userService.UpdateUser(payload);
    }

    /*
    * 
    * TODO : UPDATEUSER MUTATION 
    *
    */
    @ResolveField(() => [Article], {nullable : true})    
    public async Articles(@Parent() {_id} : User) : Promise<Article[] | void>{
        return this.articleService.getAvailableArticles(_id);
    }

    @ResolveField(() => [Report], {nullable : true})
    public async Reports(@Parent() {_id} : User) : Promise<Report[] | void>{
        return await this.reportService.getUserReports(_id);
    }   

    @ResolveField(() => [Article], {nullable : true})
    public async NonAvailableArticles(@Parent() {_id} : User) : Promise<Article[] | void>{
        return await this.articleService.getNonAvailableArticles(_id);
    }

    @ResolveField(() => [NonVerifiedArticle], {nullable: true})
    public async NVArticles(@Parent() user : User) : Promise<NonVerifiedArticle[] | void>{
        return await this.articleService.getMyNVArticles(user);
    }
}
