/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as firebase from 'firebase-admin';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async getNotificationCount(user) {
    const userId: number = user.id;

    const checkUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!checkUser) throw new UnauthorizedException();

    try {
      const allNotificationsCount = await this.prisma.userNotification.count({
        where: { userId },
      });
      return {
        message: 'notification count fetched successfully',
        notificationCount: allNotificationsCount,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async sendPush() {
    try {
      await firebase
        .messaging()
        .send({
          notification: {
            title: 'new added article',
            body: 'tough time never last, only tough people last !',
          },
          token:
            'e3DFERl8RqqeSOE5MYvRsM:APA91bHud0AosSzua6S53J4uFsBA72ahKV2HbL1sy12LwybXy24DmAChb7EbJmihK2Q02kkYRYYxtJedBGTOYizyyfZwSLXG3B0vtO0rPqgWdWWidM_-3N4',
          data: {},
          android: {
            priority: 'high',
            notification: {
              sound: 'default',
              channelId: 'default',
            },
          },
          apns: {
            headers: {
              'apns-priority': '10',
            },
            payload: {
              aps: {
                contentAvailable: true,
                sound: 'default',
              },
            },
          },
        })
        .catch((error: any) => {
          console.error(error);
        });
    } catch (error) {
      console.log(error);
      return new InternalServerErrorException(error);
    }
  }
}
