import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantInput } from './dto/create-restaurant.input';
import { CreateRestaurantPayload } from './dto/create-restaurant-payload.type';
import { RestaurantType } from './dto/restaurant.type';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator'; // adjust path if yours differs
import type { JwtPayload } from '../auth/types/jwt-payload.type';

@Resolver()
export class RestaurantResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  // No @Public() here — this requires authentication (the global
  // GqlAuthGuard already covers that), but deliberately has NO @Roles()
  // restriction and NO TenantGuard: any authenticated user (typically a
  // freshly-registered CUSTOMER) can create their first restaurant, which
  // is exactly how they become an OWNER in the first place.
  @Mutation(() => CreateRestaurantPayload)
  async createRestaurant(@Args('input') input: CreateRestaurantInput, @CurrentUser() user: JwtPayload) {
    return this.restaurantService.createRestaurant(user.sub, input);
  }

  @Roles('ADMIN')
  @Query(() => [RestaurantType])
  async restaurants(): Promise<RestaurantType[]> {
    return this.restaurantService.findAllForAdmin();
  }
 @Query(() => RestaurantType)
myRestaurant(
  @CurrentUser() user: JwtPayload,
) {
  return this.restaurantService.findMyRestaurant(user.sub);
}
}