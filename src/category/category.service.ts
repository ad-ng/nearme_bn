/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryDto, SubCategoryDTO } from './dto';
import { CategoryParamDTO } from './dto/categoryParam.dto';
import { IdParamDTO } from 'src/location/dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async fetchAllCategories(query) {
    const page = parseInt(`${query.page}`, 10) || 1;
    const limit = parseInt(`${query.limit}`) || 9;
    const order = query.order || 'asc';
    try {
      const [allCategories, totalCount] = await Promise.all([
        this.prisma.category.findMany({
          orderBy: { id: order },
          take: limit,
          skip: (page - 1) * limit,
        }),
        this.prisma.category.count(),
      ]);

      return {
        message: 'categories fetched successfully',
        data: allCategories,
        total: totalCount,
        page,
        limit,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async createCategory(dto: CategoryDto) {
    const checkCategory = await this.prisma.category.findFirst({
      where: { name: dto.name },
    });

    if (checkCategory) {
      throw new BadRequestException(`category already ${dto.name}`);
    }

    try {
      const addCategory = await this.prisma.category.create({
        data: { name: dto.name, isDoc: dto.isDoc },
      });

      return {
        message: 'category added successfully',
        data: addCategory,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateCategory(dto: CategoryDto, param: IdParamDTO) {
    const categoryId = param.id;
    const checkCategoryId = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!checkCategoryId) {
      throw new NotFoundException('invalid category');
    }

    const checkCategory = await this.prisma.category.findFirst({
      where: { name: dto.name, isDoc: dto.isDoc },
    });

    if (checkCategory) {
      throw new BadRequestException(`no change made`);
    }

    try {
      const addCategory = await this.prisma.category.update({
        where: { id: categoryId },
        data: { name: dto.name, isDoc: dto.isDoc },
      });

      return {
        message: 'category updated successfully',
        data: addCategory,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async fetchSubcategories(param: CategoryParamDTO) {
    const { name } = param;

    const checkName = await this.prisma.category.findFirst({ where: { name } });

    if (!checkName) {
      throw new NotFoundException(`no subCategory with name ${name} found`);
    }

    try {
      const allSubCategories = await this.prisma.subCategory.findMany({
        where: { categoryId: checkName.id },
        include: {
          _count: {
            select: { placeItems: true },
          },
        },
      });

      return {
        message: 'subCategories found successfully',
        data: allSubCategories,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async createSubCategories(dto: SubCategoryDTO) {
    const { categoryName, subCategoryName, featuredImage } = dto;

    const checkCategory = await this.prisma.category.findFirst({
      where: { name: categoryName },
    });

    if (!checkCategory) {
      throw new NotFoundException(`no category with ${categoryName} found`);
    }

    const checkSubCategory = await this.prisma.subCategory.findFirst({
      where: { name: subCategoryName },
    });

    if (checkSubCategory) {
      throw new BadRequestException(
        `${subCategoryName} subCategory already exist`,
      );
    }

    try {
      const newSubCategory = await this.prisma.subCategory.create({
        data: {
          name: subCategoryName,
          featuredImage,
          categoryId: checkCategory.id,
        },
      });

      return {
        message: 'subcategory added successfully',
        data: newSubCategory,
      };
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }

  async search(keyword: string, user) {
    const userId = user.id;
    const docItems = await this.prisma.docItem.findMany({
      where: {
        OR: [
          { title: { contains: keyword, mode: 'insensitive' } },
          //  { description: { contains: keyword, mode: 'insensitive' } },
          //   { summary: { contains: keyword, mode: 'insensitive' } },
        ],
      },
      take: 3,
      include: {
        author: true,
        savedItems: {
          where: { userId },
        },
      },
    });

    const placeItems = await this.prisma.placeItem.findMany({
      where: {
        OR: [
          { title: { contains: keyword, mode: 'insensitive' } },
          //  { description: { contains: keyword, mode: 'insensitive' } },
          //   { location: { contains: keyword, mode: 'insensitive' } },
        ],
      },
      take: 3,
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
      data: [
        ...docItems.map((item) => ({ type: 'doc', data: item })),
        ...placeItems.map((item) => ({ type: 'place', data: item })),
      ],
    };
  }
}
