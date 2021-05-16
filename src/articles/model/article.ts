import {ObjectType, Int, ID, Field} from '@nestjs/graphql';
import {Schema, Prop, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';

@ObjectType()
@Schema({timestamps : true, versionKey : false})
export class Article{
    @Field(() => ID)
    _id: string;

    @Field()
    @Prop({required : true})
    name : string;

    @Field()
    @Prop({required : true})
    propietary : string;

    @Field(() => Int)
    @Prop({required : true})
    stock : number;
    
    @Field()
    @Prop({required : true})
    propietary_id : string;

    @Field(() => Boolean)
    @Prop({required : true})
    accepted : boolean;

}

export type ArticleDocument = Article & Document;
export const ArticleSchema = SchemaFactory.createForClass(Article);