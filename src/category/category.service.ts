/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryDto, DocItemDTO, PlaceItemDTO, SubCategoryDTO } from './dto';
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

  async fetchDocItems(param: CategoryParamDTO, user) {
    const { name } = param;
    const userId = user.id;
    const checkCategory = await this.prisma.category.findFirst({
      where: { name },
    });

    if (!checkCategory) {
      throw new NotFoundException(` no ${name} category found`);
    }

    try {
      const allDocItems = await this.prisma.docItem.findMany({
        where: { categoryId: checkCategory.id },
        include: {
          author: true,
          savedItems: {
            where: { userId },
          },
        },
      });

      return {
        message: 'Documents Fetched Successfully',
        data: allDocItems,
      };
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }

  async createDocItem(dto: DocItemDTO, user) {
    const authorId: number = user.id;
    const checkUser = await this.prisma.user.findUnique({
      where: { id: authorId },
    });

    if (!checkUser || user.role == 'user') {
      throw new UnauthorizedException();
    }

    const { categoryName, featuredImg, location, title, summary, description } =
      dto;

    const checkCategory = await this.prisma.category.findFirst({
      where: { name: categoryName },
    });

    if (!checkCategory) {
      throw new NotFoundException(` no ${categoryName} category found`);
    }

    try {
      const newDocItem = await this.prisma.docItem.create({
        data: {
          authorId,
          description,
          summary,
          featuredImg,
          location,
          title,
          categoryId: checkCategory.id,
        },
      });

      return {
        message: 'DocItem Created Successfully',
        data: newDocItem,
      };
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }

  async fetchAllArticle(user) {
    const userId = user.id;
    try {
      const allArticles = await this.prisma.docItem.findMany({
        include: {
          author: true,
          savedItems: {
            where: { userId },
          },
        },
        orderBy: [{ id: 'desc' }],
      });

      return {
        message: 'Articles Are Fetched Successfully !',
        data: allArticles,
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
}
