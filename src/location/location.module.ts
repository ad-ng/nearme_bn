import { Module } from '@nestjs/common';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [LocationController],
  providers: [LocationService],
  imports: [AuthModule],
})
export class LocationModule {}
