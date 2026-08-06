import { Field, Float, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, MinLength } from 'class-validator';

@InputType()
export class UpdateBranchInput {
  @Field()
  @IsNotEmpty()
  restaurantId!: string;

  @Field()
  @IsNotEmpty()
  branchId!: string;

  @Field({ nullable: true })
  @IsOptional()
  @MinLength(2)
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  phone?: string;

  @Field({ nullable: true })
  @IsOptional()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  address?: string;

  @Field({ nullable: true })
  @IsOptional()
  city?: string;

  @Field({ nullable: true })
  @IsOptional()
  postalCode?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  latitude?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  longitude?: number;
}