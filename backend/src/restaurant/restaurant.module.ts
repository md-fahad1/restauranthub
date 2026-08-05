import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { RestaurantService } from './restaurant.service';
import { RestaurantResolver } from './restaurant.resolver';

@Module({
  imports: [AuthModule],
  providers: [RestaurantService, RestaurantResolver],
  exports: [RestaurantService],
})
export class RestaurantModule {}
