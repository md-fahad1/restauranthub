import { ObjectType, Field } from '@nestjs/graphql';
import { RestaurantType } from './restaurant.type';
import { UserType } from '../../auth/dto/auth-payload.type';

@ObjectType()
export class CreateRestaurantPayload {
  @Field(() => RestaurantType)
  restaurant!: RestaurantType;

  // A fresh token pair reflecting the newly-assigned OWNER role.
  // The old access token is still valid until it naturally expires, but the
  // client should switch to these immediately so restaurantId-aware checks
  // (like TenantGuard's JWT fallback) work right away without a re-login.
  @Field()
  accessToken!: string;

  @Field()
  refreshToken!: string;

  @Field(() => UserType)
  user!: UserType;
}
