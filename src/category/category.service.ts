import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryDto, SubCategoryDTO } from './dto';
import { CategoryParamDTO } from './dto/categoryParam.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async fetchAllCategories() {
    try {
      const allCategories = await this.prisma.category.findMany({
        orderBy: { id: 'desc' },
      });

      return {
        message: 'categories fetched successfully',
        data: allCategories,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async createCategory(dto: CategoryDto) {
    try {
      const addCategory = await this.prisma.category.upsert({
        where: { name: dto.name, isDoc: dto.isDoc },
        create: { name: dto.name, isDoc: dto.isDoc },
        update: { name: dto.name, isDoc: dto.isDoc },
      });

      return {
        message: 'category added successfully',
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
    const { categoryName, subCategoryName } = dto;

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
}
