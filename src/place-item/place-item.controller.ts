import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PlaceItemService } from './place-item.service';
import { AuthGuard, RolesGuard } from 'src/auth/guards';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PlaceItemDTO } from './dtos';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RoleStatus } from '@prisma/client';

@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('place-item')
export class PlaceItemController {
  constructor(private placeItemService: PlaceItemService) {}

  @Roles(RoleStatus.admin, RoleStatus.moderator)
  @Post()
  addPlaceItem(@Body() dto: PlaceItemDTO) {
    return this.placeItemService.createPlaceItem(dto);
  }
}
