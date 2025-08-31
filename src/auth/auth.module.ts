import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from 'src/mail/mail.module';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  imports: [
    JwtModule.register({ secret: process.env.JWT_SECRET, global: true }),
    MailModule,
    FirebaseModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
