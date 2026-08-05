import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { CreateRestaurantInput } from './dto/create-restaurant.input';

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

    // Reissue tokens so the JWT's roles array reflects OWNER immediately —
    // otherwise the user would need to log out and back in before any
    // @Roles('OWNER') guarded mutation would accept them.
    const tokens = await this.authService.issueTokens(userId);

    return {
      restaurant,
      ...tokens,
    };
  }

  async findAllForAdmin() {
    const restaurants = await this.prisma.restaurant.findMany({
      where: { deletedAt: null },
      include: {
        owner: { select: { id: true, firstName: true, lastName: true, email: true } },
        _count: { select: { branches: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return restaurants.map(({ _count, ...r }) => ({
      ...r,
      branchCount: _count.branches,
    }));
  }

  // --- internals -------------------------------------------------------

  private async ensureOwnerRole(userId: string): Promise<void> {
    const ownerRole = await this.prisma.role.findUniqueOrThrow({ where: { slug: 'OWNER' } });

    await this.prisma.userRole.upsert({
      where: { userId_roleId: { userId, roleId: ownerRole.id } },
      update: {},
      create: { userId, roleId: ownerRole.id },
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

    // Loop instead of a single random suffix so common names like
    // "Pizza Place" still get a short, readable slug (pizza-place,
    // pizza-place-2, ...) instead of an ugly random string on the first
    // collision, which is the common case for a demo/early-access product.
    while (await this.prisma.restaurant.findUnique({ where: { slug: candidate } })) {
      attempt += 1;
      candidate = `${base}-${attempt + 1}`;
    }

    return candidate;
  }
}