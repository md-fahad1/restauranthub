import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateBranchData {
  restaurantId: string;
  name: string;
  phone?: string;
  email?: string;
  address: string;
  city: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
}

export interface UpdateBranchData {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
}

/**
 * Isolates every Prisma call for branches behind a plain method interface.
 * The service layer depends on THIS, not on PrismaService directly — which
 * is what makes branch.service.spec.ts able to mock data access with a
 * few jest.fn()s instead of standing up a real database.
 */
@Injectable()
export class BranchRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAllByRestaurant(restaurantId: string) {
    return this.prisma.branch.findMany({
      where: { restaurantId, deletedAt: null },
      orderBy: { createdAt: 'asc' },
    });
  }

  findByIdAndRestaurant(branchId: string, restaurantId: string) {
    return this.prisma.branch.findFirst({
      where: { id: branchId, restaurantId, deletedAt: null },
    });
  }

  create(data: CreateBranchData) {
    return this.prisma.branch.create({ data });
  }

  update(branchId: string, data: UpdateBranchData) {
    return this.prisma.branch.update({ where: { id: branchId }, data });
  }

  softDelete(branchId: string) {
    return this.prisma.branch.update({
      where: { id: branchId },
      data: { deletedAt: new Date() },
    });
  }
}