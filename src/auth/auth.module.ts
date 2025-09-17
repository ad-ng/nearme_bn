import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from 'src/mail/mail.module';
import { FirebaseModule } from '../firebase/firebase.module';
import { AuthGuard } from './guards/auth.guards';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    JwtModule.register({ secret: process.env.JWT_SECRET, global: true }),
    MailModule,
    FirebaseModule,
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
