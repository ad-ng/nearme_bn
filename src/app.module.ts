import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { SavedModule } from './saved/saved.module';
import { LocationModule } from './location/location.module';
import { ReviewModule } from './review/review.module';
import { NotificationModule } from './notification/notification.module';
import { FirebaseModule } from './firebase/firebase.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { PlaceItemModule } from './place-item/place-item.module';
import { DocItemModule } from './doc-item/doc-item.module';

@Module({
  imports: [
    ConfigModule.forRoot({ expandVariables: true, isGlobal: true }),
    PrismaModule,
    AuthModule,
    MailModule,
    UserModule,
    CategoryModule,
    SavedModule,
    LocationModule,
    ReviewModule,
    NotificationModule,
    FirebaseModule,
    AnalyticsModule,
    PlaceItemModule,
    DocItemModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
