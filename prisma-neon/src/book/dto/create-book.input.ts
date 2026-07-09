import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateBookInput {
    @Field()
    title: string;

    @Field(() => String, { nullable: true })
    description?: string;

    @Field()
    author: string;
}