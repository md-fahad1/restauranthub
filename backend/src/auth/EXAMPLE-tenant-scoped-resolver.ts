/**
 * REFERENCE ONLY — not wired into the app.
 *
 * This shows the pattern you'll repeat for every tenant-scoped resolver
 * once you start Phase 2 (Restaurant Core). Delete this file once you've
 * copied the pattern into your real BranchResolver / MenuResolver / etc.
 */
import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { TenantGuard } from './guards/tenant.guard';
import { Roles } from './decorators/roles.decorator';
import { TenantId } from './decorators/tenant-id.decorator';
import { PrismaService } from '../prisma/prisma.service';

@Resolver()
export class ExampleBranchResolver {
  constructor(private readonly prisma: PrismaService) {}

  // GqlAuthGuard + RolesGuard already run globally (see app.module.ts).
  // TenantGuard is added here explicitly because this endpoint reads
  // restaurant-scoped data.
  @UseGuards(TenantGuard)
  @Roles('OWNER', 'MANAGER')
  @Query(() => [String]) // replace [String] with a real BranchType later
  async branches(@Args('restaurantId') restaurantId: string, @TenantId() tenantId: string) {
    // tenantId === restaurantId here, but ALWAYS query using tenantId
    // (the value TenantGuard already verified), never the raw argument —
    // that's what stops a user from tampering with the restaurantId
    // argument to peek at another tenant's data.
    const branches = await this.prisma.branch.findMany({
      where: { restaurantId: tenantId },
    });
    return branches.map((b) => b.name);
  }
}
