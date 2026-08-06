import { Field, Float, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { EmployeeStatus } from '../../../generated/prisma/enums';

registerEnumType(EmployeeStatus, {
  name: 'EmployeeStatus',
});

@ObjectType()
export class EmployeeUserType {
  @Field(() => ID)
  id!: string;

  @Field()
  firstName!: string;

  @Field()
  lastName!: string;

  @Field()
  email!: string;

  @Field(() => String, { nullable: true })
  phone!: string | null;
}

@ObjectType()
export class EmployeeBranchType {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;
}

@ObjectType()
export class EmployeeType {
  @Field(() => ID)
  id!: string;

  @Field()
  employeeCode!: string;

  @Field()
  designation!: string;

  @Field(() => Float)
  salary!: number;

  @Field()
  hiredAt!: Date;

  @Field(() => EmployeeStatus)
  status!: EmployeeStatus;

  @Field(() => EmployeeUserType)
  user!: EmployeeUserType;

  @Field(() => EmployeeBranchType)
  branch!: EmployeeBranchType;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

@ObjectType()
export class CreateEmployeeResult {
  @Field(() => EmployeeType)
  employee!: EmployeeType;

  @Field()
  temporaryPassword!: string;
}