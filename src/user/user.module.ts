import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticlesModule } from 'src/articles/articles.module';
import { ArticlesService } from 'src/articles/articles.service';
import { ReportsModule } from 'src/reports/reports.module';
import { Admin, AdminSchema } from './model/admin';
import {User, UserSchema} from './model/user'
import {UserResolver} from './user.resolver';
import {UserService} from './user.service';

@Module({
    imports:[        
        MongooseModule.forFeature([
            {name: User.name, schema:UserSchema}, 
            {name : Admin.name, schema : AdminSchema}]),                
        forwardRef(() => ArticlesModule),
        forwardRef(() => ReportsModule),
    ],
    providers: [UserResolver, UserService],
    exports: [UserService]    
})
export class UserModule {}
