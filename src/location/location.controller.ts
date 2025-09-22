/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { Request } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guards';
import { RolesGuard } from 'src/auth/guards';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RoleStatus } from '@prisma/client';
import { AddLocationDTO, IdParamDTO } from './dto';

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

  @Roles(RoleStatus.admin, RoleStatus.moderator)
  @Get('/admin/all')
  gettingAllBuz(@Query() query: any) {
    return this.locationService.adminFetchAllLocations(query);
  }

  @Roles(RoleStatus.admin, RoleStatus.moderator)
  @Post()
  addLocation(@Body() dto: AddLocationDTO) {
    return this.locationService.addingLocation(dto);
  }

  @Roles(RoleStatus.admin, RoleStatus.moderator)
  @Patch(':id')
  updateLocation(@Body() dto: AddLocationDTO, @Param() param: IdParamDTO) {
    return this.locationService.updateLocation(dto, param);
  }

  @Roles(RoleStatus.admin, RoleStatus.moderator)
  @Delete(':id')
  deleteLocation(@Param() param: IdParamDTO) {
    return this.locationService.deleteLocation(param);
  }

  @Roles(RoleStatus.admin, RoleStatus.moderator)
  @Get('search/all')
  searchUser(@Query('query') query: string) {
    return this.locationService.search(query);
  }
}
