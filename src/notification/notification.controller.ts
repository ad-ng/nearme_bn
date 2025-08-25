import { Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AuthGuard } from 'src/auth/guards/auth.guards';
import { RolesGuard } from 'src/auth/guards';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';

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
  getAllNotifications(@Req() req: Request) {
    return this.notificationService.fetchAllNNotifications(req.user);
  }

  @Patch('read/:notificationId')
  readNotification(@Req() req: Request, @Param() param: any) {
    return this.notificationService.readNotification(req.user, param);
  }
}
