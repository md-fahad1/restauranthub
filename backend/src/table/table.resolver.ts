import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TableService } from './table.service';
import { CreateTableInput } from './dto/create-table.input';
import { UpdateTableInput } from './dto/update-table.input';
import { TableType } from './entity/table.entity';
import { TenantGuard } from '../auth/guards/tenant.guard'; // adjust path if yours differs
import { Roles } from '../auth/decorators/roles.decorator';

@Resolver(() => TableType)
@UseGuards(TenantGuard)
export class TableResolver {
  constructor(private readonly tableService: TableService) {}

  @Roles('OWNER')
  @Query(() => [TableType], { name: 'tables' })
  findAll(
    @Args('restaurantId') restaurantId: string,
    @Args('branchId', { nullable: true }) branchId?: string,
  ) {
    return this.tableService.findAll(restaurantId, branchId);
  }

  @Roles('OWNER')
  @Query(() => TableType, { name: 'table' })
  findOne(@Args('restaurantId') restaurantId: string, @Args('tableId') tableId: string) {
    return this.tableService.findOne(restaurantId, tableId);
  }

  @Roles('OWNER')
  @Mutation(() => TableType)
  createTable(@Args('input') input: CreateTableInput) {
    return this.tableService.create(input);
  }

  @Roles('OWNER')
  @Mutation(() => TableType)
  updateTable(@Args('input') input: UpdateTableInput) {
    return this.tableService.update(input);
  }

  @Roles('OWNER')
  @Mutation(() => Boolean)
  removeTable(@Args('restaurantId') restaurantId: string, @Args('tableId') tableId: string) {
    return this.tableService.remove(restaurantId, tableId);
  }
}