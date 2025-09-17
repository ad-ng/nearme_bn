/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Controller, Get, Param } from '@nestjs/common';
import { SkipLogInService } from './skip-log-in.service';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('skip-log-in')
export class SkipLogInController {
  constructor(private skipLogInService: SkipLogInService) {}

  @Public()
  @Get('location/:provinceName')
  fetchLocations(@Param() Param: string) {
    return this.skipLogInService.fetchLocationsInProvince(
      Param['provinceName'],
    );
  }

  @Public()
  @Get('articles/all')
  fetchAllCategories() {
    return this.skipLogInService.fetchAllArticle();
  }
}
