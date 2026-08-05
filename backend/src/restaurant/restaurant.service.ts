import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { CreateRestaurantInput } from './dto/create-restaurant.input';
import { RestaurantType } from './dto/restaurant.type';

@Injectable()
export class RestaurantService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async createRestaurant(userId: string, input: CreateRestaurantInput) {
    const slug = await this.generateUniqueSlug(input.name);

    const restaurant = await this.prisma.restaurant.create({
      data: {
        ownerId: userId,
        name: input.name,
        slug,
        email: input.email,
        phone: input.phone,
        currency: input.currency ?? 'BDT',
        timezone: input.timezone ?? 'Asia/Dhaka',
      },
    });

    await this.ensureOwnerRole(userId);

    const tokens = await this.authService.issueTokens(userId);

    return {
      restaurant,
      ...tokens,
    };
  }

  async findAllForAdmin(): Promise<RestaurantType[]> {
    const restaurants = await this.prisma.restaurant.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        branches: {
          where: {
            deletedAt: null,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    return restaurants.map((restaurant) => ({
      id: restaurant.id,
      name: restaurant.name,
      slug: restaurant.slug,
      email: restaurant.email,
      phone: restaurant.phone,
      logo: restaurant.logo,
      coverImage: restaurant.coverImage,
      description: restaurant.description,
      currency: restaurant.currency,
      timezone: restaurant.timezone,
      status: restaurant.status,
      createdAt: restaurant.createdAt,
      updatedAt: restaurant.updatedAt,

      owner: {
        id: restaurant.owner.id,
        firstName: restaurant.owner.firstName,
        lastName: restaurant.owner.lastName,
        email: restaurant.owner.email,
      },

      branchCount: restaurant.branches.length,

      branches: restaurant.branches.map((branch) => ({
        id: branch.id,
        name: branch.name,
        phone: branch.phone,
        email: branch.email,
        address: branch.address,
        city: branch.city,
        postalCode: branch.postalCode,
        latitude: branch.latitude,
        longitude: branch.longitude,
        createdAt: branch.createdAt,
        updatedAt: branch.updatedAt,
      })),
    }));
  }

  async findMyRestaurant(userId: string): Promise<RestaurantType> {
    const restaurant = await this.prisma.restaurant.findFirst({
      where: {
        ownerId: userId,
        deletedAt: null,
      },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        branches: {
          where: {
            deletedAt: null,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!restaurant) {
      throw new Error('Restaurant not found');
    }

    return {
      id: restaurant.id,
      name: restaurant.name,
      slug: restaurant.slug,
      email: restaurant.email,
      phone: restaurant.phone,
      logo: restaurant.logo,
      coverImage: restaurant.coverImage,
      description: restaurant.description,
      currency: restaurant.currency,
      timezone: restaurant.timezone,
      status: restaurant.status,
      createdAt: restaurant.createdAt,
      updatedAt: restaurant.updatedAt,

      owner: {
        id: restaurant.owner.id,
        firstName: restaurant.owner.firstName,
        lastName: restaurant.owner.lastName,
        email: restaurant.owner.email,
      },

      branchCount: restaurant.branches.length,

      branches: restaurant.branches.map((branch) => ({
        id: branch.id,
        name: branch.name,
        phone: branch.phone,
        email: branch.email,
        address: branch.address,
        city: branch.city,
        postalCode: branch.postalCode,
        latitude: branch.latitude,
        longitude: branch.longitude,
        createdAt: branch.createdAt,
        updatedAt: branch.updatedAt,
      })),
    };
  }

  private async ensureOwnerRole(userId: string): Promise<void> {
    const ownerRole = await this.prisma.role.findUniqueOrThrow({
      where: { slug: 'OWNER' },
    });

    await this.prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId,
          roleId: ownerRole.id,
        },
      },
      update: {},
      create: {
        userId,
        roleId: ownerRole.id,
      },
    });
  }

  private async generateUniqueSlug(name: string): Promise<string> {
    const base = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    let candidate = base || 'restaurant';
    let attempt = 0;

    while (
      await this.prisma.restaurant.findUnique({
        where: { slug: candidate },
      })
    ) {
      attempt++;
      candidate = `${base}-${attempt + 1}`;
    }

    return candidate;
  }
}