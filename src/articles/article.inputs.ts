import { Field, Float, InputType, Int } from "@nestjs/graphql";
import { GraphQLUpload, FileUpload } from 'graphql-upload';

@InputType()
export class CreateArticleInput{
    @Field(() => String)
    name : string;

    @Field(() => Int)
    stock : number;

    @Field(() => String)
    description : string;

    @Field(() => Int)
    category : number;

    @Field(() => Boolean)
    state : boolean;

    @Field(() => GraphQLUpload)
    img : Promise<FileUpload>
}

@InputType()
export class ActionInput{
    @Field(() => Int)
    action_id : number;

    @Field(() => Float)
    price : number;

    @Field(() => String)
    exchange_article : string
}

@InputType()
export class UpdateNVArticleInput{
    @Field(() => String)
    id : string;

    @Field(() => String, {nullable : true})
    description ?: string;

    @Field(() => String, {nullable : true})
    name ?: string;

    @Field(() => Int, {nullable : true})
    stock ?: number;

    @Field(() => Int, {nullable : true})
    category ?: number;       

    @Field(() => Boolean, {nullable : true})
    state ?: boolean;

    @Field(() => GraphQLUpload, {nullable : true})
    img ?: Promise<FileUpload>

    @Field(() => Float, {nullable : true})    
    price ?: number;

    @Field(() => String, {nullable : true})    
    exchange_product ?: string;        
}

@InputType()
export class UpdateArticleInput{
    @Field(() => String)
    id : string;

    @Field(() => Int)
    stock : number;    
}