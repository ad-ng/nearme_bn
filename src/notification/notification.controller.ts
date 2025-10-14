import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AuthGuard } from 'src/auth/guards/auth.guards';
import { RolesGuard } from 'src/auth/guards';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { NotificationDTO } from './dto';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RoleStatus } from '@prisma/client';

@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get('count')
  allNotificationCount(@Req() req: Request) {
    return this.notificationService.getNotificationCount(req.user);
  }

  @Get('all')
  getAllNotifications(@Req() req: Request, @Query() query: any) {
    return this.notificationService.fetchAllNNotifications(req.user, query);
  }

  @Roles(RoleStatus.admin, RoleStatus.moderator)
  @Post('add')
  addNotification(@Body() dto: NotificationDTO) {
    return this.notificationService.createNotification(dto);
  }

  @Patch('read/:notificationId')
  readNotification(@Req() req: Request, @Param() param: any) {
    return this.notificationService.readNotification(req.user, param);
  }

  @Get('admin/all')
  adminGetAllNotifications(@Query() query: any) {
    return this.notificationService.adminFetchAllNNotifications(query);
  }

  @Patch(':id')
  adminUpdateNotification(
    @Body() dto: NotificationDTO,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.notificationService.adminUpdateNotification(id, dto);
  }
}
