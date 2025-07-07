/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryDto } from './dto';
import { CategoryParamDTO } from './dto/categoryParam.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async fetchAllCategories() {
    try {
      const allCategories = await this.prisma.category.findMany();

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
      });

      return {
        message: 'subCategories found successfully',
        data: allSubCategories,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
