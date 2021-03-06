import {Field, InputType} from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@InputType()
export class PrivilegesInput{
    @Field(() => Boolean)
    canRegisterAdmin : boolean;
    @Field(() => Boolean)
    canRegisterUser : boolean;
    @Field(() => Boolean)
    canDeleteArticles : boolean;
    @Field(() => Boolean)
    canDeleteReports : boolean;
    @Field(() => Boolean)
    canDeleteUsers : boolean;
    @Field(() => Boolean)
    canReportUsers : boolean;
    @Field(() => Boolean)
    canReportArticles : boolean;
    @Field(() => Boolean)
    canAcceptArticles : boolean;
}

@InputType()
export class CreateUserInput{
    @Field(() => String)    
    username : string;

    @Field(() => String)
    email : string;
    
    @Field(() => String)
    boleta : string;
    
    @Field(() => String)
    password : string;
    
    @Field(() => String)
    gender : string;
}

@InputType()
export class UpdateUserInput{
    @Field(() => String)
    _id : string

    @Field(() => GraphQLUpload)
    img : Promise<FileUpload>   
}