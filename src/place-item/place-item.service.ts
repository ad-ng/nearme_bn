/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PlaceItemDTO } from './dtos';
import { CategoryParamDTO } from 'src/category/dto/categoryParam.dto';
import { IdParamDTO } from 'src/location/dto';

@Injectable()
export class PlaceItemService {
  constructor(private prisma: PrismaService) {}

  async createPlaceItem(dto: PlaceItemDTO) {
    const {
      businessEmail,
      description,
      location,
      phoneNumber,
      placeImg,
      subCategoryName,
      title,
      workingHours,
      latitude,
      longitude,
    } = dto;

    const checkSubCategory = await this.prisma.subCategory.findFirst({
      where: { name: subCategoryName },
    });

    if (!checkSubCategory) {
      throw new NotFoundException(`no subcategory ${subCategoryName} found`);
    }

    try {
      const newPlaceItem = await this.prisma.placeItem.create({
        data: {
          businessEmail,
          description,
          location,
          phoneNumber,
          placeImg,
          title,
          latitude,
          longitude,
          workingHours,
          subCategoryId: checkSubCategory.id,
        },
      });

      return {
        message: 'New Place Item Added Successfully',
        data: newPlaceItem,
      };
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }

  async adminFetchAllBusiness(query) {
    const page = parseInt(`${query.page}`, 10) || 1;
    const limit = parseInt(`${query.limit}`) || 10;

    try {
      const [allBusinesses, totalCount] = await Promise.all([
        this.prisma.placeItem.findMany({
          orderBy: [{ id: 'desc' }],
          include: { subCategory: true },
          take: limit,
          skip: (page - 1) * limit,
        }),
        this.prisma.placeItem.count(),
      ]);

      return {
        message: 'Articles Are Fetched Successfully !',
        data: allBusinesses,
        total: totalCount,
        page,
        limit,
      };
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }

  async getSubCategoryItems(param: CategoryParamDTO, user) {
    const userId = user.id;
    const checkSubCategory = await this.prisma.subCategory.findFirst({
      where: { name: param.name },
    });

    if (!checkSubCategory) {
      throw new NotFoundException(`no Sub category with ${param.name}`);
    }

    try {
      const allSubcategoryItems = await this.prisma.placeItem.findMany({
        where: { subCategoryId: checkSubCategory.id },
        include: {
          savedItems: {
            where: {
              userId,
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

      return {
        message: 'Place Items found successfully',
        data: allSubcategoryItems,
      };
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }

  async updatePlaceItem(dto: PlaceItemDTO, param: IdParamDTO) {
    const {
      businessEmail,
      description,
      location,
      phoneNumber,
      placeImg,
      subCategoryName,
      title,
      workingHours,
      latitude,
      longitude,
    } = dto;

    const placeItemId = param.id;
    const CheckPlaceItem = await this.prisma.placeItem.findUnique({
      where: { id: placeItemId },
    });

    if (!CheckPlaceItem) {
      throw new NotFoundException('business not found');
    }

    const checkSubCategory = await this.prisma.subCategory.findFirst({
      where: { name: subCategoryName },
    });

    if (!checkSubCategory) {
      throw new NotFoundException(`no subcategory ${subCategoryName} found`);
    }

    try {
      const newPlaceItem = await this.prisma.placeItem.update({
        where: { id: placeItemId },
        data: {
          businessEmail,
          description,
          location,
          phoneNumber,
          placeImg,
          title,
          latitude,
          longitude,
          workingHours,
          subCategoryId: checkSubCategory.id,
        },
      });

      return {
        message: 'New Place Item Updated Successfully',
        data: newPlaceItem,
      };
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }

  async deletePlaceItem(param: IdParamDTO) {
    const placeItemId = param.id;
    const CheckPlaceItem = await this.prisma.locations.findUnique({
      where: { id: placeItemId },
    });

    if (!CheckPlaceItem) {
      throw new NotFoundException('business not found');
    }

    try {
      await this.prisma.placeItem.delete({
        where: { id: placeItemId },
      });

      return {
        message: 'business deleted successfully',
      };
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }

  async fetchRecommendedPlaces(user) {
    const userId = user.id;

    const checkUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!checkUser) throw new ForbiddenException();

    const userInterest = await this.prisma.userInterests.findMany({
      where: { userId },
    });

    const interestIds = userInterest.map((interest) => interest.categoryId);

    try {
      const allRecommendations = await this.prisma.placeItem.findMany({
        where: {
          subCategory: { categoryId: { in: interestIds } },
        },
        include: {
          savedItems: {
            where: {
              userId,
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
      return {
        message: 'Recommendations fetched successfully',
        data: allRecommendations,
      };
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }

  async search(keyword: string) {
    try {
      const allBusinesses = await this.prisma.placeItem.findMany({
        where: {
          OR: [
            { title: { contains: keyword, mode: 'insensitive' } },
            { businessEmail: { contains: keyword, mode: 'insensitive' } },
            {
              subCategory: { name: { contains: keyword, mode: 'insensitive' } },
            },
          ],
        },
      });

      return {
        message: 'businesses fetched successfully',
        data: allBusinesses,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
