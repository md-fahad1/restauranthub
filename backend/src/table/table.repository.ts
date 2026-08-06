import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TableStatus } from '@prisma/client';

const TABLE_INCLUDE = {
  branch: {
    select: { id: true, name: true },
  },
} as const;

interface CreateTableData {
  branchId: string;
  tableNumber: string;
  name?: string;
  capacity: number;
  location?: string;
}

interface UpdateTableData {
  branchId?: string;
  tableNumber?: string;
  name?: string;
  capacity?: number;
  location?: string;
  status?: TableStatus;
}

@Injectable()
export class TableRepository {
  constructor(private readonly prisma: PrismaService) {}

  // branchId is optional so the same query backs both "all tables for the
  // restaurant" (e.g. a Tables management page) and "tables for one branch"
  // (e.g. the POS table picker) without two separate methods.
  findAllByRestaurant(restaurantId: string, branchId?: string) {
    return this.prisma.diningTable.findMany({
      where: {
        restaurantId,
        deletedAt: null,
        ...(branchId && { branchId }),
      },
      include: TABLE_INCLUDE,
      orderBy: { tableNumber: 'asc' },
    });
  }

  findByIdAndRestaurant(tableId: string, restaurantId: string) {
    return this.prisma.diningTable.findFirst({
      where: { id: tableId, restaurantId, deletedAt: null },
      include: TABLE_INCLUDE,
    });
  }

  async tableNumberExistsInBranch(branchId: string, tableNumber: string, excludeTableId?: string): Promise<boolean> {
    const existing = await this.prisma.diningTable.findFirst({
      where: {
        branchId,
        tableNumber,
        deletedAt: null,
        ...(excludeTableId && { id: { not: excludeTableId } }),
      },
    });
    return existing !== null;
  }

  create(restaurantId: string, data: CreateTableData) {
    return this.prisma.diningTable.create({
      data: {
        restaurantId,
        branchId: data.branchId,
        tableNumber: data.tableNumber,
        name: data.name,
        capacity: data.capacity,
        location: data.location,
      },
      include: TABLE_INCLUDE,
    });
  }

  update(tableId: string, data: UpdateTableData) {
    return this.prisma.diningTable.update({
      where: { id: tableId },
      data: {
        ...(data.branchId && { branchId: data.branchId }),
        ...(data.tableNumber && { tableNumber: data.tableNumber }),
        ...(data.name !== undefined && { name: data.name }),
        ...(data.capacity !== undefined && { capacity: data.capacity }),
        ...(data.location !== undefined && { location: data.location }),
        ...(data.status && { status: data.status }),
      },
      include: TABLE_INCLUDE,
    });
  }

  softDelete(tableId: string) {
    return this.prisma.diningTable.update({
      where: { id: tableId },
      data: { deletedAt: new Date(), status: 'OUT_OF_SERVICE' },
    });
  }
}