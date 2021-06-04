import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateCommentInput{
    @Field(() => String)
    NVArticle_id : string;

    @Field(() => String)
    content : string;
}