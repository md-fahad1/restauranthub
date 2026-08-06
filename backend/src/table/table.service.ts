import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { TableRepository } from './table.repository';
import { CreateTableInput } from './dto/create-table.input';
import { UpdateTableInput } from './dto/update-table.input';

@Injectable()
export class TableService {
  constructor(private readonly tableRepository: TableRepository) {}

  findAll(restaurantId: string, branchId?: string) {
    return this.tableRepository.findAllByRestaurant(restaurantId, branchId);
  }

  async findOne(restaurantId: string, tableId: string) {
    const table = await this.tableRepository.findByIdAndRestaurant(tableId, restaurantId);
    if (!table) {
      throw new NotFoundException('Table not found');
    }
    return table;
  }

  async create(input: CreateTableInput) {
    const { restaurantId, branchId, tableNumber, ...data } = input;

    // Mirrors the DB's @@unique([branchId, tableNumber]) constraint —
    // checked here so the error is a clean 409 instead of a raw Prisma
    // unique-violation exception bubbling up to the client.
    if (await this.tableRepository.tableNumberExistsInBranch(branchId, tableNumber)) {
      throw new ConflictException(`Table ${tableNumber} already exists in this branch`);
    }

    return this.tableRepository.create(restaurantId, { branchId, tableNumber, ...data });
  }

  async update(input: UpdateTableInput) {
    const { restaurantId, tableId, ...data } = input;

    const existing = await this.findOne(restaurantId, tableId); // ownership check

    if (data.tableNumber) {
      const targetBranchId = data.branchId ?? existing.branch.id;
      if (await this.tableRepository.tableNumberExistsInBranch(targetBranchId, data.tableNumber, tableId)) {
        throw new ConflictException(`Table ${data.tableNumber} already exists in this branch`);
      }
    }

    return this.tableRepository.update(tableId, data);
  }

  async remove(restaurantId: string, tableId: string) {
    await this.findOne(restaurantId, tableId); // same ownership check as update
    await this.tableRepository.softDelete(tableId);
    return true;
  }
}