import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

   async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }
  async findAll() {
    return this.prisma.user.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}