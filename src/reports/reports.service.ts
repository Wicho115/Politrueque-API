import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ArticlesService } from 'src/articles/articles.service';
import { UserService } from 'src/user/user.service';
import { Report, ReportDocument } from './model/report';
import { CreateReportInput, UpdateReportInput } from './reports.input';

@Injectable()
export class ReportsService {
    constructor(
        @InjectModel(Report.name)
        private readonly reportModel : Model<ReportDocument>,
        private readonly userService :UserService,
        private readonly articleService : ArticlesService,
    ){}

    public async getReports() : Promise<Report[]>{
        return await this.reportModel.find();
    }

    public async getUserReports(user_id : string) : Promise<Report[]>{
        return await this.reportModel.find({author_id : user_id});
    }

    public async getReportsByType(type : string) : Promise<Report[]>{
        if(type != "usuario"){
            if(type!= "articulo") throw new BadRequestException("No such type");
        }
        return await this.reportModel.find({type});
    }

    public async getReportByID(_id :string) : Promise<Report>{
        return await this.reportModel.findById(_id)
    }

    public async createReport(data : CreateReportInput, user_id : string) : Promise<Report>{
        if(data.type === "usuario"){
            const user = await this.userService.searchUserByID(data.ref_id)
            if(!user) throw new BadRequestException("No such user found");
        }else if(data.type === "articulo"){
            const article = await this.articleService.getArticle(data.ref_id);
            if(!article) throw new BadRequestException("No such article found");
        }else{
            throw new BadRequestException("No such type found");
        }
        const report = new this.reportModel(data);
        report.author_id = user_id;        
        
        const savedReport = await report.save();
        return savedReport;
    }

    public async deleteReport(_id : string) : Promise<Report>{
        const report = await this.reportModel.findById(_id);
        if(!report) throw new BadRequestException("No such report found");
        return await this.reportModel.findByIdAndDelete(_id);
    }

    public async updateReport(data : UpdateReportInput) : Promise<Report>{
        const {description, title} = data;
        const report = await this.reportModel.findById(data.id);
        report.description = (!description) ? report.description : description;
        report.title = (!title) ? report.title : title;
        const savedReport = await report.save();
        return savedReport;
    }
}
