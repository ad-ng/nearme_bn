/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Controller, Get, Param } from '@nestjs/common';
import { LocationService } from './location.service';

@Controller('location')
export class LocationController {
  constructor(private locationService: LocationService) {}

  @Get(':provinceName')
  fetchLocations(@Param() Param: string) {
    return this.locationService.fetchLocationsInProvince(Param['provinceName']);
  }
}
