/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CategoryParamDTO } from 'src/category/dto/categoryParam.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SavedDTO } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class SavedService {
  constructor(private prisma: PrismaService) {}

  async fetchSavedInCategory(param: CategoryParamDTO, user, query) {
    const page = parseInt(`${query.page}`, 10) || 1;
    const limit = parseInt(`${query.limit}`) || 10;

    const { name } = param;

    const checkCategory = await this.prisma.category.findFirst({
      where: { name },
    });
    if (!checkCategory) {
      throw new NotFoundException(`no category with ${name} found !`);
    }

    const userId = user.id;
    const checkUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!checkUser) {
      throw new ForbiddenException();
    }

    try {
      const allSavedPlaceItems = await this.prisma.saved.findMany({
        where: {
          OR: [
            { docItem: { categoryId: checkCategory.id } },
            { placeItem: { subCategory: { categoryId: checkCategory.id } } },
          ],
        },
        include: {
          docItem: {
            include: {
              author: true,
              savedItems: {
                where: { userId },
              },
            },
          },
          placeItem: {
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
          },
        },
        take: limit,
        skip: (page - 1) * limit,
      });

      return {
        message: 'place items saved fetched successfully',
        data: allSavedPlaceItems,
        limit,
        page,
      };
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }

  async saveItem(dto: SavedDTO, user) {
    const { docItemId, placeItemId } = dto;
    const userId: number = user.id;
    const orConditions: Prisma.SavedWhereInput[] = [];

    if (docItemId) {
      const checkDocItem = await this.prisma.docItem.findUnique({
        where: { id: docItemId },
      });
      if (!checkDocItem) {
        throw new NotFoundException(`No docItem with id ${docItemId}`);
      }
      orConditions.push({ docItemId, userId });
    }

    if (placeItemId) {
      const checkPlaceItem = await this.prisma.placeItem.findUnique({
        where: { id: placeItemId },
      });
      if (!checkPlaceItem) {
        throw new NotFoundException(`No placeItem with id ${placeItemId}`);
      }
      orConditions.push({ placeItemId, userId });
    }

    const checkUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!checkUser) throw new ForbiddenException();

    const checkIfItemAlreadySaved = await this.prisma.saved.findFirst({
      where: { OR: orConditions },
    });
    if (checkIfItemAlreadySaved) {
      return {
        message: 'Item was already saved',
        data: checkIfItemAlreadySaved,
      };
    }

    try {
      const newSaved = await this.prisma.saved.create({
        data: { docItemId, placeItemId, userId },
      });

      return {
        message: 'Item saved successfully',
        data: newSaved,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async unsaveItem(dto: SavedDTO, user) {
    const { docItemId, placeItemId } = dto;
    const userId = user.id;
    const orConditions: Prisma.SavedWhereInput[] = [];

    if (docItemId) {
      const checkDocItem = await this.prisma.docItem.findUnique({
        where: { id: docItemId },
      });
      if (!checkDocItem) {
        throw new NotFoundException(`No docItem with id ${docItemId}`);
      }
      orConditions.push({ docItemId, userId });
    }

    if (placeItemId) {
      const checkPlaceItem = await this.prisma.placeItem.findUnique({
        where: { id: placeItemId },
      });
      if (!checkPlaceItem) {
        throw new NotFoundException(`No placeItem with id ${placeItemId}`);
      }
      orConditions.push({ placeItemId, userId });
    }

    const checkUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!checkUser) throw new ForbiddenException();

    if (orConditions.length === 0) {
      throw new BadRequestException('Provide either docItemId or placeItemId');
    }

    try {
      await this.prisma.saved.deleteMany({
        where: {
          OR: orConditions,
        },
      });

      return {
        message: 'Unsave operation completed successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async fetchTotalSavedInCategory(param: CategoryParamDTO, user) {
    const { name } = param;

    const checkCategory = await this.prisma.category.findFirst({
      where: { name },
    });
    if (!checkCategory) {
      throw new NotFoundException(`no category with ${name} found !`);
    }

    const userId = user.id;
    const checkUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!checkUser) {
      throw new ForbiddenException();
    }

    try {
      const allTotalSavedPlaceItems = await this.prisma.saved.count({
        where: {
          OR: [
            { docItem: { categoryId: checkCategory.id } },
            { placeItem: { subCategory: { categoryId: checkCategory.id } } },
          ],
        },
      });

      return {
        message: 'place items saved fetched successfully',
        data: allTotalSavedPlaceItems,
      };
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }

  async getSavedImage(user, param) {
    const { name } = param;

    const savedImages = await this.prisma.saved.findMany({
      where: {
        OR: [
          { docItem: { category: { name } } },
          { placeItem: { subCategory: { category: { name } } } },
        ],
      },
      include: {
        docItem: { select: { featuredImg: true } },
        placeItem: {
          select: { PlaceImage: { select: { url: true }, take: 1 } },
        },
      },
      omit: { id: true, docItemId: true, placeItemId: true, userId: true },
      take: 4,
    });

    const images = savedImages
      .map((item) => {
        if (item.docItem?.featuredImg) {
          return item.docItem.featuredImg;
        }

        if (item.placeItem?.PlaceImage?.[0]?.url) {
          return item.placeItem.PlaceImage[0].url;
        }

        return null;
      })
      .filter(Boolean); // removes nulls

    return { message: 'saved images fetched successfully', data: images };
  }

  async getCategoriesWithSavedCounts(user) {
    const categories = await this.prisma.category.findMany({
      include: {
        docItem: {
          include: {
            savedItems: {
              where: {
                userId: user.id,
              },
            },
          },
        },
        subCategory: {
          include: {
            placeItems: {
              include: {
                savedItems: {
                  where: {
                    userId: user.id,
                  },
                },
              },
            },
          },
        },
      },
    });

    return {
      data: categories
        .map((category) => {
          const docItemSavedCount = category.docItem.reduce(
            (sum, item) => sum + item.savedItems.length,
            0,
          );

          const placeItemSavedCount = category.subCategory.reduce(
            (sum, sub) => {
              return (
                sum +
                sub.placeItems.reduce(
                  (placeSum, placeItem) =>
                    placeSum + placeItem.savedItems.length,
                  0,
                )
              );
            },
            0,
          );

          const totalSavedItems = docItemSavedCount + placeItemSavedCount;

          return {
            categoryId: category.id,
            categoryName: category.name,
            isDoc: category.isDoc,
            totalSavedItems,
          };
        })
        .filter((category) => category.totalSavedItems > 0),
    };
  }
}
