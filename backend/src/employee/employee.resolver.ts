import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeInput } from './dto/create-employee.input';
import { UpdateEmployeeInput } from './dto/update-employee.input';
import { EmployeeType, CreateEmployeeResult } from './entity/employee.entity';
import { TenantGuard } from '../auth/guards/tenant.guard'; // adjust path if yours differs
import { Roles } from '../auth/decorators/roles.decorator';

@Resolver(() => EmployeeType)
@UseGuards(TenantGuard) // confirms the caller owns :restaurantId — mirrors BranchResolver
export class EmployeeResolver {
  constructor(private readonly employeeService: EmployeeService) {}

  @Roles('OWNER')
  @Query(() => [EmployeeType], { name: 'employees' })
  findAll(@Args('restaurantId') restaurantId: string) {
    return this.employeeService.findAll(restaurantId);
  }

  @Roles('OWNER')
  @Query(() => EmployeeType, { name: 'employee' })
  findOne(@Args('restaurantId') restaurantId: string, @Args('employeeId') employeeId: string) {
    return this.employeeService.findOne(restaurantId, employeeId);
  }

  @Roles('OWNER')
  @Mutation(() => CreateEmployeeResult)
  createEmployee(@Args('input') input: CreateEmployeeInput) {
    return this.employeeService.create(input);
  }

  @Roles('OWNER')
  @Mutation(() => EmployeeType)
  updateEmployee(@Args('input') input: UpdateEmployeeInput) {
    return this.employeeService.update(input);
  }

  @Roles('OWNER')
  @Mutation(() => Boolean)
  removeEmployee(@Args('restaurantId') restaurantId: string, @Args('employeeId') employeeId: string) {
    return this.employeeService.remove(restaurantId, employeeId);
  }
}