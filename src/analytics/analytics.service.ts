/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AnalyticsDTO } from './dto';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async saveEvent(dto: AnalyticsDTO, user) {
    const userId = user.id;
    const { categoryId, docItemId, locationId, placeItemId, provinceId, type } =
      dto;
    try {
      const newRegisteredEvent = await this.prisma.interactionEvent.create({
        data: {
          categoryId,
          docItemId,
          locationId,
          placeItemId,
          provinceId,
          type,
          userId,
        },
      });
      return {
        message: 'Interaction Event Saved Successfully',
        data: newRegisteredEvent,
      };
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }

  async countryAnalytics() {
    try {
      // 1. Get total users (with country set)
      const totalUsers = await this.prisma.user.count({
        where: { country: { not: null } },
      });

      if (totalUsers === 0) return [];

      // 2. Get top 5 countries
      const topCountries = await this.prisma.user.groupBy({
        by: ['country'],
        _count: { country: true },
        orderBy: { _count: { country: 'desc' } },
        where: { country: { not: null } },
        take: 5,
      });

      // 3. Sum of top 5 users
      const topUsersCount = topCountries.reduce(
        (sum, c) => sum + c._count.country,
        0,
      );

      // 4. "Others" count = total - top5
      const othersCount = totalUsers - topUsersCount;

      // 5. Format results with percentages
      const distribution = [
        ...topCountries.map((c) => ({
          country: c.country ?? 'Unknown',
          count: c._count.country,
          percentage: Number(
            ((c._count.country / totalUsers) * 100).toFixed(2),
          ),
        })),
        ...(othersCount > 0
          ? [
              {
                country: 'Others',
                count: othersCount,
                percentage: Number(
                  ((othersCount / totalUsers) * 100).toFixed(2),
                ),
              },
            ]
          : []),
      ];

      return {
        message: 'country analytics fetched successfully',
        data: distribution,
      };
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }

  async mostVisitedPlaceItem() {
    try {
      const mostVisitedPlaces = await this.prisma.interactionEvent.groupBy({
        by: ['placeItemId'],
        _count: { placeItemId: true },
        where: { type: 'CLICK', placeItemId: { not: null } },
        orderBy: { _count: { placeItemId: 'desc' } },
        take: 10,
      });

      const placeItemIds = mostVisitedPlaces
        .map((p) => p.placeItemId)
        .filter((id): id is number => id !== null);

      const placeItems = await this.prisma.placeItem.findMany({
        where: { id: { in: placeItemIds } },
        include: {
          subCategory: true,
        },
      });

      const result = mostVisitedPlaces.map((p) => {
        const place = placeItems.find((pi) => pi.id === p.placeItemId);
        return {
          ...p,
          placeItem: place,
        };
      });

      return {
        message: 'PlaceItem analytics fetched successfully',
        data: result,
      };
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }
}
