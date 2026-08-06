import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';
import { TableStatus } from '../../../generated/prisma/enums';

@InputType()
export class UpdateTableInput {
  @Field()
  @IsNotEmpty()
  restaurantId!: string; // tenant ownership check, same role as UpdateBranchInput/UpdateEmployeeInput

  @Field()
  @IsNotEmpty()
  tableId!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  branchId?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  tableNumber?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  name?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  location?: string;

  @Field(() => TableStatus, { nullable: true })
  @IsOptional()
  status?: TableStatus;
}