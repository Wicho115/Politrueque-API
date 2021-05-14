import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from './model/admin';
import {User, UserSchema} from './model/user'
import {UserResolver} from './user.resolver';
import {UserService} from './user.service';

@Module({
    imports:[
        MongooseModule.forFeature([{name: User.name, schema:UserSchema}, {name : Admin.name, schema : AdminSchema}])        
    ],
    providers: [UserResolver, UserService],
    exports: [UserService]
})
export class UserModule {}
