import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MailModule } from 'src/mail/mail.module';
import { AuthModule } from 'src/auth/auth.module';
import { ImagesModule } from 'src/images/images.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [MailModule, forwardRef(() => AuthModule), ImagesModule],
})
export class UserModule {}
