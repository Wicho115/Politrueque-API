import {Field, ObjectType, ID} from '@nestjs/graphql';
import {Schema, Prop, SchemaFactory} from '@nestjs/mongoose';
import { GraphQLUpload } from 'graphql-upload';
import {Document} from 'mongoose';

@ObjectType()
@Schema({timestamps : true, versionKey : false})
export class User{
    @Field(() => ID)
    _id : string;

    @Field()
    @Prop({required : true, unique : true})
    username : string;

    @Field()
    @Prop({required : true, unique : true})
    email : string;

    @Prop({required : true, unique: true})
    boleta : string;

    @Prop({required : true})
    password : string;

    @Field()
    @Prop({required : true})
    gender : string;   
        
    
    @Field(() => String, {nullable : true})
    @Prop({required : false})
    img?:string;

    @Prop({required : false})
    imgID ?: string;        

}   

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
