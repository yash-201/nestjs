import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Book {
    @Field()
    id: string;

    @Field()
    title: string;

    @Field(() => String, { nullable: true })
    description?: string | null;

    @Field()
    author: string;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}