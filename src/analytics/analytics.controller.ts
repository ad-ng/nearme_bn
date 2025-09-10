import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsDTO } from './dto';
import { AuthGuard, RolesGuard } from 'src/auth/guards';
import { Request } from 'express';
@UseGuards(AuthGuard, RolesGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Post()
  addingAnInteractionEvent(@Body() dto: AnalyticsDTO, @Req() req: Request) {
    return this.analyticsService.saveEvent(dto, req.user);
  }

  @Get('countries')
  fetchCountryData() {
    return this.analyticsService.countryAnalytics();
  }

  @Get('placeItem')
  fetchPlaceItemData() {
    return this.analyticsService.mostVisitedPlaceItem();
  }
}
