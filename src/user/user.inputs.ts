import {Field, InputType, Int} from '@nestjs/graphql';
import { GraphQLUpload } from 'graphql-upload';

@InputType()
export class CreateUserInput{
    @Field(() => String)    
    username : string;

    @Field(() => String)
    mail : string;
    
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

    @Field(() => String, {nullable : true})
    username ?: string;

    @Field(() => GraphQLUpload, {nullable : true})
    Image ?: GraphQLUpload;
    
}

@InputType()
export class UpdateMailInput{
    @Field(() => String)
    _id : string;

    @Field(() => String)
    password : string;

    @Field(() => String)
    newPassword : string;
}

@InputType()
export class FileInput{
    @Field(() => GraphQLUpload)
    file : GraphQLUpload;
}