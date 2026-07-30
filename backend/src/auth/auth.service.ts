import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { JwtPayload } from './types/jwt-payload.type';

const SALT_ROUNDS = 12;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(input: RegisterInput) {
    const existing = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

    const user = await this.prisma.user.create({
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phone: input.phone,
        password: hashedPassword,
      },
    });

    // Everyone starts with a baseline role. Elevated roles (OWNER, MANAGER, etc.)
    // get assigned explicitly later (e.g. when they create a restaurant).
    const customerRole = await this.prisma.role.findUnique({ where: { slug: 'CUSTOMER' } });
    if (customerRole) {
      await this.prisma.userRole.create({
        data: { userId: user.id, roleId: customerRole.id },
      });
    }

    return this.issueTokens(user.id);
  }

  async login(input: LoginInput) {
    const user = await this.prisma.user.findUnique({
      where: { email: input.email },
      include: {
        userRoles: { include: { role: true } },
        employee: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const matches = await bcrypt.compare(input.password, user.password);
    if (!matches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return this.issueTokens(user.id);
  }

  async refresh(userId: string, tokenId: string) {
    // Rotate: revoke the old refresh token, issue a brand new pair.
    // This limits the damage if a refresh token is ever stolen.
    await this.prisma.refreshToken.update({
      where: { id: tokenId },
      data: { revoked: true },
    });

    return this.issueTokens(userId);
  }

  async logout(userId: string) {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revoked: false },
      data: { revoked: true },
    });
    return true;
  }

  // --- internals -----------------------------------------------------------

  private async issueTokens(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: {
        userRoles: { include: { role: true } },
        employee: true,
      },
    });

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles: user.userRoles.map((ur) => ur.role.slug),
      restaurantId: user.employee?.restaurantId,
      branchId: user.employee?.branchId,
    };

    const accessToken = this.jwt.sign(payload, {
      secret: this.config.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: (this.config.get<string>('JWT_ACCESS_EXPIRES_IN') ?? '15m') as any,
    });

    const refreshTokenRecord = await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: 'pending', // placeholder, replaced right below
        expiresAt: new Date(Date.now() + this.refreshTtlMs()),
      },
    });

    const rawRefreshToken = this.jwt.sign(
      { sub: user.id, tokenId: refreshTokenRecord.id },
      {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: (this.config.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '7d') as any,
      },
    );

    // Store only a hash of the refresh token, never the raw value
    const tokenHash = await bcrypt.hash(rawRefreshToken, SALT_ROUNDS);
    await this.prisma.refreshToken.update({
      where: { id: refreshTokenRecord.id },
      data: { tokenHash },
    });

    return {
      accessToken,
      refreshToken: rawRefreshToken,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roles: payload.roles,
      },
    };
  }

  private refreshTtlMs(): number {
    // 7 days, matching JWT_REFRESH_EXPIRES_IN default above
    return 7 * 24 * 60 * 60 * 1000;
  }
}
