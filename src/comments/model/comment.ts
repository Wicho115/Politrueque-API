import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {Document} from 'mongoose'

@ObjectType()
@Schema({versionKey : false, timestamps : true})
export class Comment{
    @Field(() => ID)
    _id : string

    @Field(() => String)
    @Prop({required: true})
    author_id : string;

    @Field(() => String)
    @Prop({required : true})
    NVArticle_id : string;

    @Field(()=> String)
    @Prop({required: true})
    content : string;
}

export type CommentDocument = Comment & Document;
export const CommentSchema = SchemaFactory.createForClass(Comment);