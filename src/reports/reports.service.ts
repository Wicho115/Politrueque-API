import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose';
import { CreateReportDTO } from './dto/reports.dto';
import { Report } from './interfaces/reports.interface'

@Injectable()
export class ReportsService {
    constructor(@InjectModel('Reports') private readonly reportModel: Model<Report>) { }

    async getReports(): Promise<Report[]> {
        try {
            return await this.reportModel.find();
        } catch (error) {
            throw new BadRequestException('UwU');
        }
    }

    async getReport(id: string): Promise<Report> {
        try {
            return await this.reportModel.findById(id);
        } catch (error) {
            throw new BadRequestException(`UwU didn't find the id`);
        }
    }

    async createReport(createReportDTO: CreateReportDTO): Promise<Report> {
        try {
            const report = new this.reportModel(createReportDTO);
            return await report.save();
        } catch (error) {
            throw new BadRequestException(`UwU `,);
        }
    }

    async updateReport(id: string, createReportDTO: CreateReportDTO): Promise<Report> {
        try {
            return await this.reportModel.findByIdAndUpdate(id, createReportDTO, { new: true });
        } catch (error) {
            throw new BadRequestException(`UwU didn't find the id`);
        }
    }

    async deleteReport(id :string) : Promise<Report>{
        try {
            return await this.reportModel.findByIdAndDelete(id);
        } catch (error) {
            throw new BadRequestException(`UwU didn't find the id`);
        }
    }

}
