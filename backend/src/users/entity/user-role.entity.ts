import { Field, ID, ObjectType } from '@nestjs/graphql';
import { RoleEntity } from './role.entity';

@ObjectType()
export class UserRoleEntity {
  @Field(() => ID)
  id!: string;

  @Field(() => RoleEntity)
  role!: RoleEntity;
}