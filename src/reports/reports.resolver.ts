import { BadRequestException, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CurrentPrivileges } from 'src/auth/decorators/current-privileges.decorator';
import { AdminAuthGuard } from 'src/auth/guards/admin-auth.guard';
import { Privileges } from 'src/user/interface/privileges.interface';
import { User } from 'src/user/model/user';
import { UserService } from 'src/user/user.service';
import { handleMongoError } from 'src/utils/error.util';
import { Report } from './model/report';
import { CreateReportInput, UpdateReportInput } from './reports.input';
import { ReportsService } from './reports.service';
import {CurrentAdminUser} from '../auth/decorators/current-adminuser.decorator'
import { Article } from 'src/articles/model/article';
import { ArticlesService } from 'src/articles/articles.service';

@Resolver(() => Report)
export class ReportsResolver {
    constructor(
        private readonly reportService : ReportsService,
        private readonly userService : UserService,
        private readonly articleService : ArticlesService,
    ){}

    @Query(() => [Report])
    @UseGuards(AdminAuthGuard)
    public async getReports() : Promise<Report[] | void>{
        return await this.reportService.getReports();
    }

    @Query(() => [Report])
    @UseGuards(AdminAuthGuard)
    public async getReportsByType(
        @Args('type', {type : () => String}) type : string,
    ) : Promise<Report[] | void>{
        return await this.reportService.getReportsByType(type)
    }

    @Query(() => Report)
    @UseGuards(AdminAuthGuard)
    public async getReport(
        @Args('id', {type : () => String}) id : string,
    ) : Promise<Report | void>{
        return await this.reportService.getReportByID(id)
    }

    @Mutation(() => Report)
    @UseGuards(AdminAuthGuard)
    public async createReport(
        @Args('payload') payload : CreateReportInput,        
        @CurrentAdminUser() {_id} : User,
        @CurrentPrivileges() privileges : Privileges,
    ) : Promise<Report | void>{
        const {type} = payload;        
        
        if(type === "usuario"){
            if(!privileges.canReportUsers) throw new UnauthorizedException("You don't have enough privileges");
        }else if(type === "articulo"){
            if(!privileges.canReportArticles) throw new UnauthorizedException("You don't have enough privileges");
        }else{
            throw new BadRequestException("No such type found");
        }

        return await this.reportService.createReport(payload, _id);
    }

    @Mutation(() => Report)
    @UseGuards(AdminAuthGuard)
    public async deleteReport(
        @Args('id', {type : () => String}) id : string,
        @CurrentPrivileges() privileges : Privileges,
    ) : Promise<Report | void>{
        if(!privileges.canDeleteReports) throw new UnauthorizedException("You don't have enough privileges");
        return await this.reportService.deleteReport(id);
    }

    @Mutation(() => Report)
    @UseGuards(AdminAuthGuard)
    public async updateReport(
        @Args('payload') payload : UpdateReportInput,
        @CurrentAdminUser() user : User,
    ) : Promise<Report | void>{
        const report = await this.reportService.getReportByID(payload.id);
        if(!report) throw new BadRequestException("No such report found");
        if(report.author_id != user._id) throw new UnauthorizedException("You are not the author of this report");
        return await this.reportService.updateReport(payload);
    }

    @ResolveField(() => User)
    public async author(@Parent() {author_id} : Report) : Promise<User>{
        return await this.userService.searchUserByID(author_id);
    }

    @ResolveField(() => Article, {nullable : true})
    public async article_ref(@Parent() {ref_id} : Report) : Promise<Article>{
        return await this.articleService.getArticle(ref_id);
    }

    @ResolveField(() => User, {nullable : true})
    public async user_ref(@Parent() {ref_id} : Report) : Promise<User>{
        return await this.userService.searchUserByID(ref_id);
    }
}
