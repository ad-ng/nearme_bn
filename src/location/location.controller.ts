/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { LocationService } from './location.service';
import { Request } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guards';
import { RolesGuard } from 'src/auth/guards';

@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('location')
export class LocationController {
  constructor(private locationService: LocationService) {}

  @Get(':provinceName')
  fetchLocations(@Param() Param: string) {
    return this.locationService.fetchLocationsInProvince(Param['provinceName']);
  }

  @Get('doc/:provinceName')
  fetchDocItems(@Param() Param: string, @Req() req: Request) {
    return this.locationService.fetchDocItemsInProvince(
      Param['provinceName'],
      req.user,
    );
  }
}
