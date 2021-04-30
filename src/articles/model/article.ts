import {ObjectType, Int, ID, Field} from '@nestjs/graphql';
import {Schema, Prop} from '@nestjs/mongoose'

@ObjectType()
@Schema()
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


}