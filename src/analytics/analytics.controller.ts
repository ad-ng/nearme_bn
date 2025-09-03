import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsDTO } from './dto';
import { AuthGuard, RolesGuard } from 'src/auth/guards';
@UseGuards(AuthGuard, RolesGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Post()
  addingAnInteractionEvent(@Body() dto: AnalyticsDTO) {
    return this.analyticsService.saveEvent(dto);
  }
}
