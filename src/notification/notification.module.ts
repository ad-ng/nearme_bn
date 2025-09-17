import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { FirebaseModule } from '../firebase/firebase.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService],
  imports: [FirebaseModule, AuthModule],
})
export class NotificationModule {}
