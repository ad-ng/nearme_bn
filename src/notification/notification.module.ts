import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService],
  imports: [FirebaseModule],
})
export class NotificationModule {}
