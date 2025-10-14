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
import { NotificationDTO } from './dto';

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

  async fetchAllNNotifications(user, query) {
    const page = parseInt(`${query.page}`, 10) || 1;
    const limit = parseInt(`${query.limit}`) || 10;
    const userId: number = user.id;

    const checkUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!checkUser) throw new UnauthorizedException();

    try {
      const allNotifications = await this.prisma.userNotification.findMany({
        where: { userId },
        include: { notification: true },
        take: limit,
        skip: (page - 1) * limit,
      });
      return {
        message: 'notifications fetched successfully',
        data: allNotifications,
        limit,
        page,
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

  async createNotification(dto: NotificationDTO) {
    if (dto.categoryId) {
      const checkCategory = await this.prisma.category.findUnique({
        where: { id: dto.categoryId },
      });
      if (!checkCategory) throw new NotFoundException('incorrect categoryId');
    }

    try {
      const newNotification = await this.prisma.notification.create({
        data: dto,
      });

      // fire-and-forget user notifications + push
      void (async () => {
        try {
          const interestedUsers = await this.prisma.user.findMany({
            where: {
              userInterests: {
                some: { categoryId: dto.categoryId },
              },
            },
          });

          const notificationData = interestedUsers.map((user) => ({
            isRead: false,
            notificationId: newNotification.id,
            userId: user.id,
          }));

          await this.prisma.userNotification.createMany({
            data: notificationData,
            skipDuplicates: true,
          });

          // fire-and-forget push notifications
          interestedUsers.forEach((user) => {
            if (user.firebaseDeviceId) {
              void this.sendFirebasePushNotification(
                dto.title,
                dto.body,
                user.firebaseDeviceId,
              );
            }
          });
        } catch (err) {
          console.error('Error while creating user notifications', err);
        }
      })();

      return {
        message: 'notification created successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async sendFirebasePushNotification(
    notificationTitle: string,
    notificationBody: string,
    firebaseDeviceId: string,
  ) {
    try {
      await firebase.messaging().send({
        notification: {
          title: notificationTitle,
          body: notificationBody,
        },
        token: firebaseDeviceId,
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
      });
    } catch (error) {
      console.error('Error sending push notification:', error);
    }
  }

  async adminFetchAllNNotifications(query) {
    const page = parseInt(`${query.page}`, 10) || 1;
    const limit = parseInt(`${query.limit}`) || 10;

    try {
      const allNotifications = await this.prisma.notification.findMany({
        include: { category: true },
        take: limit,
        skip: (page - 1) * limit,
      });
      return {
        message: 'notifications fetched successfully',
        data: allNotifications,
        limit,
        page,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
