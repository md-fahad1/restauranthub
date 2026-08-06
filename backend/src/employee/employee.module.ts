import { Module } from '@nestjs/common';
import { EmployeeResolver } from './employee.resolver';
import { EmployeeService } from './employee.service';
import { EmployeeRepository } from './employee.repository';
import { PrismaModule } from '../prisma/prisma.module'; // omit if PrismaService is global

@Module({
  imports: [PrismaModule],
  providers: [EmployeeResolver, EmployeeService, EmployeeRepository],
  exports: [EmployeeService],
})
export class EmployeeModule {}