import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { EmployeeStatus } from '../../generated/prisma/enums';

const EMPLOYEE_INCLUDE = {
  user: {
    select: { id: true, firstName: true, lastName: true, email: true, phone: true },
  },
  branch: {
    select: { id: true, name: true },
  },
} as const;

interface CreateEmployeeData {
  restaurantId: string;
  branchId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  designation: string;
  salary: number;
  hiredAt: string;
  password: string; // already generated (plaintext) by the service, hashed here
}

interface UpdateEmployeeData {
  branchId?: string;
  designation?: string;
  salary?: number;
  hiredAt?: string;
  status?: EmployeeStatus;
}

@Injectable()
export class EmployeeRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAllByRestaurant(restaurantId: string) {
    return this.prisma.employee.findMany({
      where: { restaurantId, deletedAt: null },
      include: EMPLOYEE_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
  }

  findByIdAndRestaurant(employeeId: string, restaurantId: string) {
    return this.prisma.employee.findFirst({
      where: { id: employeeId, restaurantId, deletedAt: null },
      include: EMPLOYEE_INCLUDE,
    });
  }

  async employeeCodeExists(code: string): Promise<boolean> {
    const existing = await this.prisma.employee.findUnique({ where: { employeeCode: code } });
    return existing !== null;
  }

  async emailInUse(email: string): Promise<boolean> {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    return existing !== null;
  }

  // Creates the User and Employee together — if either insert fails, both
  // roll back, so a broken half-created account can never exist.
  async createWithUser(employeeCode: string, data: CreateEmployeeData) {
    const passwordHash = await bcrypt.hash(data.password, 10);

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          password: passwordHash,
        },
      });

      return tx.employee.create({
        data: {
          userId: user.id,
          restaurantId: data.restaurantId,
          branchId: data.branchId,
          employeeCode,
          designation: data.designation,
          salary: data.salary,
          hiredAt: new Date(data.hiredAt),
        },
        include: EMPLOYEE_INCLUDE,
      });
    });
  }

  update(employeeId: string, data: UpdateEmployeeData) {
    return this.prisma.employee.update({
      where: { id: employeeId },
      data: {
        ...(data.branchId && { branchId: data.branchId }),
        ...(data.designation && { designation: data.designation }),
        ...(data.salary !== undefined && { salary: data.salary }),
        ...(data.hiredAt && { hiredAt: new Date(data.hiredAt) }),
        ...(data.status && { status: data.status }),
      },
      include: EMPLOYEE_INCLUDE,
    });
  }

  softDelete(employeeId: string) {
    return this.prisma.employee.update({
      where: { id: employeeId },
      data: { deletedAt: new Date(), status: EmployeeStatus.RESIGNED },
    });
  }
}