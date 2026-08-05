import { Resolver, Query } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UserEntity } from '../users/entity/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/types/jwt-payload.type';

@Resolver(() => UserEntity)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [UserEntity], { name: 'users' })
  async findAllUsers() {
    return this.usersService.findAll();
  }

  @Query(() => UserEntity, { name: 'me' })
  async me(@CurrentUser() user: JwtPayload) {
    return this.usersService.findById(user.sub);
  }
}