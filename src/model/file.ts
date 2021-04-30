import {Field, ObjectType} from '@nestjs/graphql'

@ObjectType()
export class File{
    @Field(() => String)
    url : string;
}