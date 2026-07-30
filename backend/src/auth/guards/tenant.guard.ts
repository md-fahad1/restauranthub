import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtPayload } from '../types/jwt-payload.type';

/**
 * TenantGuard — the single place that decides "is this user allowed to touch
 * data belonging to restaurant X?"
 *
 * How the restaurantId is found, in priority order:
 *   1. GraphQL argument: `restaurantId` or `input.restaurantId`
 *   2. `x-restaurant-id` request header (handy for owners managing multiple restaurants)
 *   3. The restaurantId already baked into the user's JWT (most Employees only ever
 *      belong to one restaurant, so this covers the common case with zero friction)
 *
 * Access is granted if:
 *   - user.roles includes SUPER_ADMIN, OR
 *   - the user is an Employee whose JWT restaurantId matches, OR
 *   - the user owns the restaurant (checked against the DB, since an owner
 *     can own more than one restaurant and that can't fit in the JWT safely)
 *
 * On success, it sets `req.tenantId` so resolvers/services never have to
 * re-derive or re-trust a client-supplied restaurantId again.
 */
@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    const user: JwtPayload = req.user;
    const args = ctx.getArgs();

    if (!user) {
      throw new ForbiddenException('Not authenticated');
    }

    const requestedRestaurantId: string | undefined =
      args?.restaurantId ?? args?.input?.restaurantId ?? req.headers?.['x-restaurant-id'] ?? user.restaurantId;

    if (!requestedRestaurantId) {
      throw new ForbiddenException('No restaurant context provided for this request');
    }

    if (user.roles?.includes('SUPER_ADMIN')) {
      req.tenantId = requestedRestaurantId;
      return true;
    }

    if (user.restaurantId && user.restaurantId === requestedRestaurantId) {
      req.tenantId = requestedRestaurantId;
      return true;
    }

    const owns = await this.prisma.restaurant.findFirst({
      where: { id: requestedRestaurantId, ownerId: user.sub },
      select: { id: true },
    });

    if (owns) {
      req.tenantId = requestedRestaurantId;
      return true;
    }

    throw new ForbiddenException("You don't have access to this restaurant");
  }
}
