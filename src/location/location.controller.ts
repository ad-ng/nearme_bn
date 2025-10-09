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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { Request } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guards';
import { RolesGuard } from 'src/auth/guards';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RoleStatus } from '@prisma/client';
import { AddLocationDTO, IdParamDTO } from './dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('location')
export class LocationController {
  constructor(private locationService: LocationService) {}

  @Get(':provinceName')
  fetchLocations(@Param() Param: string, @Query() query: any) {
    return this.locationService.fetchLocationsInProvince(
      Param['provinceName'],
      query,
    );
  }

  @Get('doc/:provinceName')
  fetchDocItems(
    @Param() Param: string,
    @Req() req: Request,
    @Query() query: any,
  ) {
    return this.locationService.fetchDocItemsInProvince(
      Param['provinceName'],
      req.user,
      query,
    );
  }

  @Roles(RoleStatus.admin, RoleStatus.moderator)
  @Get('/admin/all')
  gettingAllBuz(@Query() query: any) {
    return this.locationService.adminFetchAllLocations(query);
  }

  @Roles(RoleStatus.admin, RoleStatus.moderator)
  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  addLocation(
    @Body() dto: AddLocationDTO,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.locationService.addingLocation(dto, files);
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
  searchUser(@Query() query: any) {
    return this.locationService.search(query);
  }
}
