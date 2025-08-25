import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { firebaseAdminProvider } from './admin-firebase.provider';

@Module({
  controllers: [NotificationController],
  providers: [firebaseAdminProvider, NotificationService],
})
export class NotificationModule {}
