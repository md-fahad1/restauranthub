import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthPayload } from './dto/auth-payload.type';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { RefreshTokenInput } from './dto/refresh-token.input';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtRefreshPayload } from './types/jwt-payload.type';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => AuthPayload)
  async register(@Args('input') input: RegisterInput) {
    return this.authService.register(input);
  }

  @Public()
  @Mutation(() => AuthPayload)
  async login(@Args('input') input: LoginInput) {
    return this.authService.login(input);
  }

  @Public()
  @UseGuards(AuthGuard('jwt-refresh'))
  @Mutation(() => AuthPayload)
  async refreshToken(@Args('input') _input: RefreshTokenInput, @CurrentUser() user: unknown) {
    const payload = user as JwtRefreshPayload;
    return this.authService.refresh(payload.sub, payload.tokenId);
  }

  @Mutation(() => Boolean)
  async logout(@CurrentUser() user: { sub: string }) {
    return this.authService.logout(user.sub);
  }
}
