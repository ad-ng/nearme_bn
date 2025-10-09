import { Module } from '@nestjs/common';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { AuthModule } from 'src/auth/auth.module';
import { ImagesModule } from 'src/images/images.module';

@Module({
  controllers: [LocationController],
  providers: [LocationService],
  imports: [AuthModule, ImagesModule],
})
export class LocationModule {}
