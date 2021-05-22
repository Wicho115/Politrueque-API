import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class CreateReportInput{
    @Field(() => String)
    title: string;

    @Field(() => String)
    description : string;

    @Field(() => String)
    type : string;

    @Field(() => String)
    ref_id : string;
}

@InputType()
export class UpdateReportInput{
    @Field(() => String)
    id : string;

    @Field(() => String, {nullable : true})
    title ?: string;

    @Field(() => String, {nullable : true})
    description ?: string;
}