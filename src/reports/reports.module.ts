import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import {MongooseModule} from '@nestjs/mongoose'
import { ReportSchema } from './schemas/reports.schema';

@Module({
  imports : [MongooseModule.forFeature([
    {name : 'Reports' , schema : ReportSchema}
  ])
  ],
  controllers: [ReportsController],
  providers: [ReportsService]
})
export class ReportsModule {}
