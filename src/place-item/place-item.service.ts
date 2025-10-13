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
import { ImagesService } from 'src/images/images.service';
import { PlaceImage } from '@prisma/client';

@Injectable()
export class PlaceItemService {
  constructor(
    private prisma: PrismaService,
    private imageService: ImagesService,
  ) {}

  async createPlaceItem(dto: PlaceItemDTO, files: Express.Multer.File[]) {
    const {
      businessEmail,
      description,
      location,
      phoneNumber,
      subCategoryName,
      title,
      workingHours,
      latitude,
      longitude,
    } = dto;

    // Check if the subcategory exists
    const checkSubCategory = await this.prisma.subCategory.findFirst({
      where: { name: subCategoryName },
    });

    if (!checkSubCategory) {
      throw new NotFoundException(`No subcategory "${subCategoryName}" found`);
    }

    // Upload images to Supabase storage
    const uploadedImages: string[] = [];

    for (const [index, file] of files.entries()) {
      const fileName = `business/${title.trim().split(' ').join('-')}-${Date.now()}-${index + 1}.jpg`;

      // upload to Supabase
      await this.imageService.uploadSingleImage(file, fileName);

      const imageUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/nearme/${fileName}`;
      uploadedImages.push(imageUrl);
    }

    // Create the main place item record
    const newPlaceItem = await this.prisma.placeItem.create({
      data: {
        businessEmail,
        description,
        location,
        phoneNumber,
        title,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        workingHours,
        subCategoryId: checkSubCategory.id,
      },
    });

    // Save image URLs in the PlaceImage table
    const placeImagesData = uploadedImages.map((url) => ({
      url,
      placeId: newPlaceItem.id,
    }));

    await this.prisma.placeImage.createMany({
      data: placeImagesData,
    });

    return {
      message: 'New Place Item Added Successfully',
      data: newPlaceItem,
    };
  }

  async adminFetchAllBusiness(query) {
    const page = parseInt(`${query.page}`, 10) || 1;
    const limit = parseInt(`${query.limit}`) || 10;

    try {
      const [allBusinesses, totalCount] = await Promise.all([
        this.prisma.placeItem.findMany({
          orderBy: [{ id: 'desc' }],
          include: { subCategory: true, PlaceImage: true },
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
          PlaceImage: true,
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
          title,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
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

    const allPlaceItemImages: PlaceImage[] =
      await this.prisma.placeImage.findMany({
        where: { placeId: placeItemId },
      });

    const allPlaceImagesFileNames: string[] = [];
    allPlaceItemImages.map((placeItemImg) => {
      const extractFilePath = (url: string): string => {
        const base = `${process.env.SUPABASE_URL}/storage/v1/object/public/nearme/`;
        return url.replace(base, '');
      };

      const fileName = extractFilePath(placeItemImg.url);
      allPlaceImagesFileNames.push(fileName);
    });

    try {
      if (allPlaceItemImages.length != 0) {
        await this.imageService.deleteManyImage(allPlaceImagesFileNames);
      }

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

  async fetchRecommendedPlaces(user, query) {
    const page = parseInt(`${query.page}`, 10) || 1;
    const limit = parseInt(`${query.limit}`) || 10;

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
          PlaceImage: true,
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
        take: limit,
        skip: (page - 1) * limit,
      });
      return {
        message: 'Recommendations fetched successfully',
        data: allRecommendations,
      };
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }

  async search(allQuery) {
    const { query } = allQuery;
    const page = parseInt(`${query.page}`, 10) || 1;
    const limit = parseInt(`${query.limit}`) || 10;

    try {
      const allBusinesses = await this.prisma.placeItem.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { businessEmail: { contains: query, mode: 'insensitive' } },
            {
              subCategory: { name: { contains: query, mode: 'insensitive' } },
            },
          ],
        },
        take: limit,
        skip: (page - 1) * limit,
      });

      return {
        message: 'businesses fetched successfully',
        data: allBusinesses,
        limit,
        page,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async searchInSubCategory(subCategoryName: string, allQuery) {
    const { query } = allQuery;
    const page = parseInt(`${query.page}`, 10) || 1;
    const limit = parseInt(`${query.limit}`) || 10;

    const checkSubCategory = await this.prisma.subCategory.findFirst({
      where: { name: subCategoryName },
    });

    if (!checkSubCategory) {
      throw new NotFoundException();
    }

    try {
      const allBusinesses = await this.prisma.placeItem.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { businessEmail: { contains: query, mode: 'insensitive' } },
          ],
          AND: [
            {
              subCategory: {
                name: { equals: subCategoryName },
              },
            },
          ],
        },
        take: limit,
        skip: (page - 1) * limit,
      });

      return {
        message: 'businesses fetched successfully',
        data: allBusinesses,
        limit,
        page,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
