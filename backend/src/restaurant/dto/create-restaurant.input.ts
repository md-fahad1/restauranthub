import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsEmail, MinLength } from 'class-validator';

@InputType()
export class CreateRestaurantInput {
  @Field()
  @IsNotEmpty({ message: 'Restaurant name is required' })
  @MinLength(2)
  name!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail({}, { message: 'Contact email must be valid' })
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  phone?: string;

  @Field({ nullable: true })
  @IsOptional()
  currency?: string;

  @Field({ nullable: true })
  @IsOptional()
  timezone?: string;
}
