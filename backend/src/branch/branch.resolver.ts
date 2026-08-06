import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BranchService } from './branch.service';
import { BranchType } from './entity/branch.entity';
import { CreateBranchInput } from './dto/create-branch.input';
import { UpdateBranchInput } from './dto/update-branch.input';
import { TenantGuard } from '../auth/guards/tenant.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { TenantId } from '../auth/decorators/tenant-id.decorator';

@Resolver(() => BranchType)
export class BranchResolver {
  constructor(private readonly branchService: BranchService) {}

  @UseGuards(TenantGuard)
  @Query(() => [BranchType])
  async branches(@Args('restaurantId') restaurantId: string, @TenantId() tenantId: string) {
    return this.branchService.findAll(tenantId);
  }

  @UseGuards(TenantGuard)
  @Query(() => BranchType)
  async branch(
    @Args('restaurantId') restaurantId: string,
    @Args('branchId') branchId: string,
    @TenantId() tenantId: string,
  ) {
    return this.branchService.findOne(tenantId, branchId);
  }

  @UseGuards(TenantGuard)
  @Roles('OWNER', 'MANAGER')
  @Mutation(() => BranchType)
  async createBranch(@Args('input') input: CreateBranchInput, @TenantId() tenantId: string) {
    return this.branchService.create({ ...input, restaurantId: tenantId });
  }

  @UseGuards(TenantGuard)
  @Roles('OWNER', 'MANAGER')
  @Mutation(() => BranchType)
  async updateBranch(@Args('input') input: UpdateBranchInput, @TenantId() tenantId: string) {
    return this.branchService.update({ ...input, restaurantId: tenantId });
  }

  @UseGuards(TenantGuard)
  @Roles('OWNER', 'MANAGER')
  @Mutation(() => Boolean)
  async deleteBranch(
    @Args('restaurantId') restaurantId: string,
    @Args('branchId') branchId: string,
    @TenantId() tenantId: string,
  ) {
    return this.branchService.remove(tenantId, branchId);
  }
}