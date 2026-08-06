import { Injectable, NotFoundException } from '@nestjs/common';
import { BranchRepository } from './branch.repository';
import { CreateBranchInput } from './dto/create-branch.input';
import { UpdateBranchInput } from './dto/update-branch.input';

@Injectable()
export class BranchService {
  constructor(private readonly branchRepository: BranchRepository) {}

  findAll(restaurantId: string) {
    return this.branchRepository.findAllByRestaurant(restaurantId);
  }

  async findOne(restaurantId: string, branchId: string) {
    const branch = await this.branchRepository.findByIdAndRestaurant(branchId, restaurantId);
    if (!branch) {
      throw new NotFoundException('Branch not found');
    }
    return branch;
  }

  create(input: CreateBranchInput) {
    const { restaurantId, ...data } = input;
    return this.branchRepository.create({ ...data, restaurantId });
  }

  async update(input: UpdateBranchInput) {
    const { restaurantId, branchId, ...data } = input;

    // TenantGuard already confirmed the caller has access to restaurantId,
    // but has no idea whether branchId actually belongs to THAT
    // restaurant — that's this check. Skipping it would let one
    // restaurant's owner edit a different restaurant's branch just by
    // guessing/enumerating branch IDs.
    await this.findOne(restaurantId, branchId);

    return this.branchRepository.update(branchId, data);
  }

  async remove(restaurantId: string, branchId: string) {
    await this.findOne(restaurantId, branchId); // same ownership check as update
    await this.branchRepository.softDelete(branchId);
    return true;
  }
}