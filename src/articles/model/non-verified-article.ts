import { ObjectType, Int, ID, Field, Float } from "@nestjs/graphql";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import {Document } from 'mongoose';


@ObjectType()
@Schema({timestamps : true, versionKey : false})
export class NonVerifiedArticle{
    @Field(() => ID)
    _id: string;

    @Field()
    @Prop({required : true})
    name : string;

    @Field(() => String)
    @Prop({required : true})
    description : string;

    @Field(() => Int)
    @Prop({required : true})
    stock : number;
      
    @Prop({required : true})
    propietary_id : string;  

    @Field(() => Int)
    @Prop({required : true})
    category : number;

    @Field(() => Boolean)
    @Prop({required : true})
    state : boolean;

    @Field(() => Boolean)
    @Prop({required : true})
    available : boolean;

    @Field(() => Int)
    @Prop({required : true})
    action_id : number;

    @Field(() => Float, {nullable : true})
    @Prop()
    price ?: number;

    @Field(() => String, {nullable : true})
    @Prop()
    exchange_product ?: string;    

    @Field(() => String, {nullable  : true})
    @Prop({required : true})
    img:string;

    @Prop({required : true})
    imgID : string;        

}

export type NonVerifiedArticleDocument = NonVerifiedArticle & Document;
export const NonVerifiedArticleSchema = SchemaFactory.createForClass(NonVerifiedArticle);