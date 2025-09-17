import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  imports: [AuthModule],
})
export class AnalyticsModule {}
