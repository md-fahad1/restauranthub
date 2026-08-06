import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BranchType } from '../../branch/entity/branch.entity';
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
email!: string | null;

@Field(() => String, { nullable: true })
phone!: string | null;

@Field(() => String, { nullable: true })
logo!: string | null;

@Field(() => String, { nullable: true })
coverImage!: string | null;

@Field(() => String, { nullable: true })
description!: string | null;

  @Field()
  currency!: string;

  @Field()
  timezone!: string;

  @Field()
  status!: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  @Field(() => RestaurantOwnerType)
  owner!: RestaurantOwnerType;

  @Field(() => Int)
  branchCount!: number;

  @Field(() => [BranchType])
  branches!: BranchType[];
}