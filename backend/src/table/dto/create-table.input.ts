import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';

@InputType()
export class CreateTableInput {
  @Field()
  @IsNotEmpty({ message: 'Restaurant is required' })
  restaurantId!: string;

  @Field()
  @IsNotEmpty({ message: 'Branch is required' })
  branchId!: string;

  @Field()
  @IsNotEmpty({ message: 'Table number is required' })
  tableNumber!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  name?: string;

  @Field(() => Int)
  @IsInt()
  @Min(1, { message: 'Capacity must be at least 1' })
  capacity!: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  location?: string;
}