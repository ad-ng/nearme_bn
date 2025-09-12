/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Controller, Get, Param } from '@nestjs/common';
import { SkipLogInService } from './skip-log-in.service';

@Controller('skip-log-in')
export class SkipLogInController {
  constructor(private skipLogInService: SkipLogInService) {}

  @Get(':provinceName')
  fetchLocations(@Param() Param: string) {
    return this.skipLogInService.fetchLocationsInProvince(
      Param['provinceName'],
    );
  }
}
