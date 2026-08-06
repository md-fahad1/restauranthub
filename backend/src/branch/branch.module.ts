import { Module } from '@nestjs/common';
import { BranchService } from './branch.service';
import { BranchRepository } from './branch.repository';
import { BranchResolver } from './branch.resolver';

@Module({
  providers: [BranchService, BranchRepository, BranchResolver],
  exports: [BranchService],
})
export class BranchModule {}