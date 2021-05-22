import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/user.module';
import { ReportsResolver } from './reports.resolver';
import { ReportsService } from './reports.service';
import {Report, ReportSchema} from './model/report'
import { ArticlesModule } from 'src/articles/articles.module';

@Module({
  imports : [MongooseModule.forFeature([
        {name : Report.name, schema : ReportSchema}
      ]),
      forwardRef(() => UserModule),
      forwardRef(() => ArticlesModule),
  ],
  providers: [ReportsResolver, ReportsService],
  exports: [ReportsService]
})
export class ReportsModule {}
