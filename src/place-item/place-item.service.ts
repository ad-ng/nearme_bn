/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PlaceItemDTO } from './dtos';

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
}
