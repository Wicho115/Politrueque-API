import { Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({timestamps : true, versionKey : false})
export class Admin{
    @Prop({required : true, unique : true})
    ID : string;

    @Prop(raw({
        canRegisterAdmin : {type : Boolean, required : true},
        canRegisterUser : {type : Boolean, required : true},
        canDeleteArticles : {type : Boolean, required : true},
        canDeleteReports : {type : Boolean, required : true},
        canDeleteUsers : {type : Boolean, required : true},
        canReportUsers : {type : Boolean, required : true},
        canReportArticles : {type : Boolean, required : true},
        canAcceptArticles : {type : Boolean, required : true},
    }) )
    privileges : Record<string, any>
}

export type AdminDocument = Admin & Document;
export const AdminSchema = SchemaFactory.createForClass(Admin);