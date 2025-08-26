/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
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
        where: { userId, isRead: false },
      });
      return {
        message: 'notification count fetched successfully',
        notificationCount: allNotificationsCount,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async fetchAllNNotifications(user) {
    const userId: number = user.id;

    const checkUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!checkUser) throw new UnauthorizedException();

    try {
      const allNotifications = await this.prisma.userNotification.findMany({
        where: { userId },
        include: { notification: true },
      });
      return {
        message: 'notifications fetched successfully',
        data: allNotifications,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async readNotification(user, param) {
    const userId: number = user.id;
    const notificationId = parseInt(`${param.notificationId}`, 10);

    const checkUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!checkUser) throw new UnauthorizedException();

    const checkNotification = await this.prisma.userNotification.findUnique({
      where: { id: notificationId },
    });
    if (!checkNotification) throw new NotFoundException();
    try {
      await this.prisma.userNotification.update({
        where: { id: notificationId, userId },
        data: { isRead: true },
      });
      return {
        message: 'notification marked isRead: true',
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async sendPush(
    notificationTitle: string,
    notificationBody: string,
    firebaseDeviceId: string,
  ) {
    try {
      await firebase
        .messaging()
        .send({
          notification: {
            title: notificationTitle,
            body: notificationBody,
          },
          token: firebaseDeviceId,
          //  'e3DFERl8RqqeSOE5MYvRsM:APA91bHud0AosSzua6S53J4uFsBA72ahKV2HbL1sy12LwybXy24DmAChb7EbJmihK2Q02kkYRYYxtJedBGTOYizyyfZwSLXG3B0vtO0rPqgWdWWidM_-3N4',
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
