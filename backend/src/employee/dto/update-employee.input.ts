import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsNumber, Min, IsDateString } from 'class-validator';
import { EmployeeStatus } from '../../../generated/prisma/enums';

@InputType()
export class UpdateEmployeeInput {
  @Field()
  @IsNotEmpty()
  restaurantId!: string;

  @Field()
  @IsNotEmpty()
  employeeId!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  branchId?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  designation?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  salary?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsDateString()
  hiredAt?: string;

  @Field(() => EmployeeStatus, { nullable: true })
  @IsOptional()
  status?: EmployeeStatus;
}