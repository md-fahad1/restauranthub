import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsEmail, IsOptional, IsNumber, Min, MinLength, IsDateString } from 'class-validator';

@InputType()
export class CreateEmployeeInput {
  @Field()
  @IsNotEmpty({ message: 'Restaurant is required' })
  restaurantId!: string;

  @Field()
  @IsNotEmpty({ message: 'Branch is required' })
  branchId!: string;

  @Field()
  @IsNotEmpty({ message: 'First name is required' })
  firstName!: string;

  @Field()
  @IsNotEmpty({ message: 'Last name is required' })
  lastName!: string;

  @Field()
  @IsEmail({}, { message: 'A valid email is required' })
  email!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  phone?: string;

  @Field()
  @IsNotEmpty({ message: 'Designation is required' })
  designation!: string;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  salary!: number;

  @Field()
  @IsDateString()
  hiredAt!: string;

  // If omitted, the service generates one and returns it once via
  // CreateEmployeeResult.temporaryPassword.
  @Field(() => String, { nullable: true })
  @IsOptional()
  @MinLength(8)
  password?: string;
}