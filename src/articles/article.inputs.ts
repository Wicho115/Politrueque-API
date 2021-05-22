import { Field, Float, InputType, Int } from "@nestjs/graphql";

@InputType()
export class CreateArticleInput{
    @Field(() => String)
    name : string;

    @Field(() => Int)
    stock : number;

    @Field(() => String)
    description : string;

    @Field(() => String)
    category : string;

    @Field(() => Boolean)
    state : boolean;
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

    @Field(() => String, {nullable : true})
    category ?: string;    

    @Field(() => Boolean, {nullable : true})
    state ?: boolean;

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