import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { TableStatus } from '@prisma/client';

registerEnumType(TableStatus, {
  name: 'TableStatus',
});

@ObjectType()
export class TableBranchType {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;
}

@ObjectType()
export class TableType {
  @Field(() => ID)
  id!: string;

  @Field()
  tableNumber!: string;

  @Field(() => String, { nullable: true })
  name!: string | null;

  @Field(() => Int)
  capacity!: number;

  @Field(() => TableStatus)
  status!: TableStatus;

  @Field(() => String, { nullable: true })
  location!: string | null;

  @Field(() => TableBranchType)
  branch!: TableBranchType;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}