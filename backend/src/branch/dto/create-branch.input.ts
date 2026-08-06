import { Field, Float, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, MinLength } from 'class-validator';

@InputType()
export class CreateBranchInput {
  // TenantGuard reads this to confirm the caller owns/works at this
  // restaurant before the resolver method body ever runs.
  @Field()
  @IsNotEmpty()
  restaurantId!: string;

  @Field()
  @IsNotEmpty()
  @MinLength(2)
  name!: string;

  @Field({ nullable: true })
  @IsOptional()
  phone?: string;

  @Field({ nullable: true })
  @IsOptional()
  email?: string;

  @Field()
  @IsNotEmpty({ message: 'Address is required' })
  address!: string;

  @Field()
  @IsNotEmpty({ message: 'City is required' })
  city!: string;

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