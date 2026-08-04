import { Resolver, Query } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UserEntity } from '../users/entity/user.entity';


@Resolver(() => UserEntity)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [UserEntity], { name: 'users' })
  async findAllUsers() {
    return this.usersService.findAll();
  }
}