/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AnalyticsDTO } from './dto';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async saveEvent(dto: AnalyticsDTO, user) {
    const userId = user.id;
    const {
      categoryId,
      docItemId,
      locationId,
      placeItemId,
      subCategoryId,
      provinceId,
      type,
    } = dto;
    try {
      const newRegisteredEvent = await this.prisma.interactionEvent.create({
        data: {
          categoryId,
          docItemId,
          locationId,
          placeItemId,
          provinceId,
          type,
          subCategoryId,
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
          savedItems: {
            where: {
              userId: 3,
            },
          },
          subCategory: {
            include: {
              _count: {
                select: { placeItems: true },
              },
            },
          },
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

  async mostVisitedArticle() {
    try {
      const mostVisitedArticles = await this.prisma.interactionEvent.groupBy({
        by: ['docItemId'],
        _count: { docItemId: true },
        where: { type: 'CLICK', docItemId: { not: null } },
        orderBy: { _count: { docItemId: 'desc' } },
        take: 10,
      });

      const docItemIds = mostVisitedArticles
        .map((p) => p.docItemId)
        .filter((id): id is number => id !== null);

      const docItems = await this.prisma.docItem.findMany({
        where: { id: { in: docItemIds } },
        include: {
          author: true,
          savedItems: {
            where: {
              userId: 3,
            },
          },
        },
      });

      const result = mostVisitedArticles.map((p) => {
        const article = docItems.find((pi) => pi.id === p.docItemId);
        return {
          ...p,
          articleItem: article,
        };
      });

      return {
        message: 'articles analytics fetched successfully',
        data: result,
      };
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }

  async mostVisitedLocationPlaces() {
    try {
      const mostVisitedLocation = await this.prisma.interactionEvent.groupBy({
        by: ['locationId'],
        _count: { locationId: true },
        where: { type: 'CLICK', locationId: { not: null } },
        orderBy: { _count: { locationId: 'desc' } },
        take: 10,
      });

      const locationIds = mostVisitedLocation
        .map((p) => p.locationId)
        .filter((id): id is number => id !== null);

      const locationItems = await this.prisma.locations.findMany({
        where: { id: { in: locationIds } },
      });

      const result = mostVisitedLocation.map((p) => {
        const location = locationItems.find((pi) => pi.id === p.locationId);
        return {
          ...p,
          locationItem: location,
        };
      });

      return {
        message: 'Location analytics fetched successfully',
        data: result,
      };
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }

  async categoryAnalytics() {
    try {
      // Step 1: Get top 10 most visited categories
      const mostVisited = await this.prisma.interactionEvent.groupBy({
        by: ['categoryId'],
        _count: { categoryId: true },
        where: { type: 'CLICK', categoryId: { not: null } },
        orderBy: { _count: { categoryId: 'desc' } },
        take: 10,
      });

      const categoryIds = mostVisited
        .map(({ categoryId }) => categoryId!)
        .filter(Boolean);

      if (categoryIds.length === 0) {
        return { message: 'No category analytics available', data: [] };
      }

      // Step 2: Fetch category details in one query
      const categories = await this.prisma.category.findMany({
        where: { id: { in: categoryIds } },
      });

      const categoryMap = new Map(categories.map((c) => [c.id, c]));

      // Step 3: Merge results
      const result = mostVisited.map((item) => {
        const { categoryId, _count } = item;
        return {
          count: _count.categoryId,
          categoryItem: categoryMap.get(categoryId as number) ?? null,
        };
      });

      return {
        message: 'Category analytics fetched successfully',
        data: result,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async subCategoryAnalytics() {
    try {
      // Step 1: Get top 10 most visited subcategories
      const mostVisited = await this.prisma.interactionEvent.groupBy({
        by: ['subCategoryId'],
        _count: { subCategoryId: true },
        where: { type: 'CLICK', subCategoryId: { not: null } },
        orderBy: { _count: { subCategoryId: 'desc' } },
        take: 6,
      });

      const subCategoryIds = mostVisited
        .map(({ subCategoryId }) => subCategoryId!)
        .filter(Boolean);

      if (subCategoryIds.length === 0) {
        return { message: 'No subcategory analytics available', data: [] };
      }

      // Step 2: Fetch category details in one query
      const subCategories = await this.prisma.subCategory.findMany({
        where: { id: { in: subCategoryIds } },
        include: {
          _count: {
            select: { placeItems: true },
          },
        },
      });

      const subCategoryMap = new Map(subCategories.map((c) => [c.id, c]));

      // Step 3: Merge results
      const result = mostVisited.map((item) => {
        const { subCategoryId, _count } = item;
        return {
          count: _count.subCategoryId,
          subCategoryItem: subCategoryMap.get(subCategoryId as number) ?? null,
        };
      });

      return {
        message: 'subCategory analytics fetched successfully',
        data: result,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getUsageBy7Buckets() {
    const buckets = [
      { label: '6 AM', hours: [6, 7, 8] },
      { label: '9 AM', hours: [9, 10, 11] },
      { label: '12 PM', hours: [12, 13, 14] },
      { label: '3 PM', hours: [15, 16, 17] },
      { label: '6 PM', hours: [18, 19, 20] },
      { label: '9 PM', hours: [21, 22, 23] },
      { label: '12 AM', hours: [0, 1, 2, 3, 4, 5] },
    ];
    const events = await this.prisma.interactionEvent.findMany({
      select: { createdAt: true },
    });

    // Initialize counts
    const distribution = buckets.map((b) => ({ label: b.label, count: 0 }));

    for (const e of events) {
      const hour = e.createdAt.getHours();
      const bucketIndex = buckets.findIndex((b) => b.hours.includes(hour));
      if (bucketIndex >= 0) {
        distribution[bucketIndex].count += 1;
      }
    }

    // Find peak bucket
    const peak = distribution.reduce((max, curr) =>
      curr.count > max.count ? curr : max,
    );

    return { peak, data: distribution };
  }

  async getRegistrationsLast7Days() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const users = await this.prisma.user.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      select: { createdAt: true },
    });

    // Days of week mapping (0 = Sunday, 6 = Saturday)
    const days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'];

    // Initialize counts (to make sure all 7 days appear, even if 0 users)
    const distribution = days.map((day) => ({ label: day, count: 0 }));

    for (const user of users) {
      const dayIndex = user.createdAt.getDay(); // 0-6
      distribution[dayIndex].count += 1;
    }

    return {
      message: 'registered users fetched successfully',
      data: distribution,
    };
  }
}
