import { Field, Float, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BranchType {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field(() => String, { nullable: true })
  email!: string | null;

  @Field(() => String, { nullable: true })
  phone!: string | null;

  @Field()
  address!: string;

  @Field()
  city!: string;

  @Field(() => String, { nullable: true })
  postalCode!: string | null;

  @Field(() => Float, { nullable: true })
  latitude!: number | null;

  @Field(() => Float, { nullable: true })
  longitude!: number | null;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}