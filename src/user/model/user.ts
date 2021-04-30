import {Field, ObjectType, ID} from '@nestjs/graphql';
import {Schema, Prop, SchemaFactory} from '@nestjs/mongoose';
import { GraphQLUpload } from 'graphql-upload';
import {Document} from 'mongoose';
import * as bcrypt from 'bcryptjs';

@ObjectType()
@Schema({timestamps : true, versionKey : false})
export class User{
    @Field(() => ID)
    _id : string;

    @Field()
    @Prop({required : true})
    username : string;

    @Field()
    @Prop({required : true})
    mail : string;

    @Prop({required : true, unique: true})
    boleta : string;

    @Prop({required : true})
    password : string;

    @Field()
    @Prop({required : true})
    gender : string;    
    
    @Field()
    @Prop()
    imgURL:string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
