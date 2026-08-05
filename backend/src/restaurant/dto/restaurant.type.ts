import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class RestaurantOwnerType {
  @Field()
  id!: string;

  @Field()
  firstName!: string;

  @Field()
  lastName!: string;

  @Field()
  email!: string;
}

@ObjectType()
export class RestaurantType {
  @Field()
  id!: string;

  @Field()
  name!: string;

  @Field()
  slug!: string;

  @Field(() => String, { nullable: true })
  email?: string | null;

  @Field(() => String, { nullable: true })
  phone?: string | null;

  @Field()
  currency!: string;

  @Field()
  timezone!: string;

  @Field()
  status!: string;

  @Field(() => Int)
  branchCount!: number;

  @Field()
  createdAt!: Date;

  @Field(() => RestaurantOwnerType)
  owner!: RestaurantOwnerType;
}