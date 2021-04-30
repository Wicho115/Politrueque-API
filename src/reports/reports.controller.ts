import { Controller, Get, Post, Put, Delete, HttpStatus, Res, Param, Body, Query, NotFoundException } from '@nestjs/common';
import { ReportsService } from './reports.service';
import {Response} from 'express'
import { CreateReportDTO } from './dto/reports.dto';

@Controller('reports')
export class ReportsController {
    constructor(private readonly reportsService : ReportsService){}
    
    @Get('/')
    async getReports(@Res() res : Response){
        const reports  = await this.reportsService.getReports();        
        return res.status(HttpStatus.OK).json({
            message : 'Reports Fetched Succesfully',
            data : reports
        });
    }

    @Get(':reportId')
    async getReport(@Res() res :Response, @Param('reportId') id : string){
        const report = await this.reportsService.getReport(id);
        return res.status(HttpStatus.OK).json({
            message : 'Report send was succesfull',
            data : report
        });
    }

    @Post('/create')
    async createReport(@Res() res :Response, @Body() createReportDTO : CreateReportDTO){
        const newReport = await this.reportsService.createReport(createReportDTO);
        return res.status(HttpStatus.OK).json({
            message: 'Report created succedfully',
            data : newReport
        })
    }

    @Put('/update')
    async updateReport(@Res() res : Response, @Body() createReportDTO : CreateReportDTO, @Query('reportId') id : string){
        const updatedReport = await this.reportsService.updateReport(id, createReportDTO);

        if(!updatedReport) throw new NotFoundException('Report not found');

        return res.status(HttpStatus.OK).json({
            message : 'Report Updated Succesfully',
            data: updatedReport
        })
    }

    @Delete('/delete')
    async deleteReport(@Res() res :Response, @Query('reportId') id : string){
        const deletedReport = await this.reportsService.deleteReport(id);

        if(!deletedReport) throw new NotFoundException('Report not found');

        return res.status(HttpStatus.OK).json({
            message : 'Report deleted succesfully',
            data : deletedReport
        });
    }

}
