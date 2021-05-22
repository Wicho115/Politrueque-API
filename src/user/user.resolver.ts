import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { UserService } from './user.service'
import { User } from './model/user'
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { UpdateUserInput, CreateUserInput, PrivilegesInput } from './user.inputs'
import { BadRequestException, PayloadTooLargeException, UnauthorizedException, UseGuards } from '@nestjs/common';
import { handleMongoError } from '../utils/error.util'
import { File } from '../model/file';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { AdminAuthGuard } from 'src/auth/guards/admin-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Privileges } from './interface/privileges.interface'
import { Request } from 'express'
import { CurrentPrivileges } from 'src/auth/decorators/current-privileges.decorator';
import { Article } from 'src/articles/model/article';
import { ArticlesService } from 'src/articles/articles.service';
import { Report } from 'src/reports/model/report';
import { ReportsService } from 'src/reports/reports.service';

@Resolver(() => User)
export class UserResolver {
    constructor(
        private readonly userService: UserService,
        private readonly articleService : ArticlesService,
        private readonly reportService : ReportsService,
    ) { }

    @Query(() => String)
    public async hello() {
        return await this.userService.upload();
    }

    @Query(() => User)
    @UseGuards(AdminAuthGuard)
    public bye(@CurrentUser() user: User, @CurrentPrivileges() privileges: Privileges) {
        console.log(privileges);

        //return user as User;
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

    /*
    * 
    * TODO : UPDATEUSER MUTATION 
    *
    */
    @ResolveField(() => [Article], {nullable : true})    
    public async Articles(@Parent() {_id} : User) : Promise<Article[] | void>{
        return this.articleService.getArticleByUserId(_id);
    }

    @ResolveField(() => [Report], {nullable : true})
    public async Reports(@Parent() {_id} : User) : Promise<Report[] | void>{
        return await this.reportService.getUserReports(_id);
    }

    @Mutation(() => File)
    public async uploadFile(@Args('file', { type: () => GraphQLUpload }) file: Promise<FileUpload>) {
        return this.userService.GetFile(file);
    }

}
