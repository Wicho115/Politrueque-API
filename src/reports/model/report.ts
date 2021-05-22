import { Field, ID, ObjectType } from "@nestjs/graphql";
import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import { Document } from "mongoose";

@ObjectType()
@Schema({timestamps : true, versionKey : false})
export class Report{
    @Field(() => ID)
    _id : string;

    @Field(() => String)
    @Prop({required : true})
    author_id : string;

    @Field(() => String)
    @Prop({ required : true})
    title : string;

    @Field(() => String)
    @Prop({required : true})
    description : string;

    @Field(() => String)
    @Prop({required : true})
    type : string;

    @Field(() => String)
    @Prop({required : true})
    ref_id : string;
}

export type ReportDocument = Report & Document;
export const ReportSchema = SchemaFactory.createForClass(Report);