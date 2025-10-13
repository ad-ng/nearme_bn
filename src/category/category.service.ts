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
import { ImagesService } from 'src/images/images.service';

@Injectable()
export class CategoryService {
  constructor(
    private prisma: PrismaService,
    private imageService: ImagesService,
  ) {}

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

  async deleteCategory(param: IdParamDTO) {
    const categoryId = param.id;
    const checkCategory = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!checkCategory) {
      throw new NotFoundException('category not found');
    }

    try {
      await this.prisma.category.delete({
        where: { id: categoryId },
      });

      return {
        message: 'category deleted successfully',
      };
    } catch (error) {
      return new InternalServerErrorException(error);
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

  async createSubCategories(dto: SubCategoryDTO, file: Express.Multer.File) {
    const { categoryName, subCategoryName } = dto;

    if (file == null) {
      return 'no file added';
    }

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
      const fileName = `subcategory/${subCategoryName.trim().split(' ').join('-')}`;

      const imageUrl: string = `${process.env.SUPABASE_URL}/storage/v1/object/public/nearme/${fileName}`;

      await this.imageService.uploadSingleImage(file, fileName);

      const newSubCategory = await this.prisma.subCategory.create({
        data: {
          name: subCategoryName,
          featuredImage: imageUrl,
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

  async updateSubCategories(
    dto: SubCategoryDTO,
    param: IdParamDTO,
    file?: Express.Multer.File,
  ) {
    const subCategoryId = param.id;

    const existingSubCategory = await this.prisma.subCategory.findUnique({
      where: { id: subCategoryId },
    });

    if (!existingSubCategory) {
      throw new NotFoundException('Invalid subcategory');
    }

    const { categoryName, subCategoryName } = dto;

    const category = await this.prisma.category.findFirst({
      where: { name: categoryName },
    });

    if (!category) {
      throw new NotFoundException(
        `No category with name "${categoryName}" found`,
      );
    }

    try {
      // Case 1: No new file
      if (!file) {
        const updated = await this.prisma.subCategory.update({
          where: { id: subCategoryId },
          data: {
            name: subCategoryName,
            categoryId: category.id,
          },
        });
        return { message: 'Subcategory updated successfully', data: updated };
      }

      // Case 2: New file provided
      let fileName: string;

      if (existingSubCategory.featuredImage) {
        // Extract old file name from URL
        const extractFilePath = (url: string): string => {
          const base = `${process.env.SUPABASE_URL}/storage/v1/object/public/nearme/`;
          return url.replace(base, '');
        };

        fileName = extractFilePath(existingSubCategory.featuredImage);
      } else {
        // New subcategory image
        fileName = `subcategory/${subCategoryName.trim().split(' ').join('-')}`;
      }

      await this.imageService.uploadSingleImage(file, fileName);

      const imageUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/nearme/${fileName}`;

      const updated = await this.prisma.subCategory.update({
        where: { id: subCategoryId },
        data: {
          name: subCategoryName,
          featuredImage: imageUrl,
          categoryId: category.id,
        },
      });

      return { message: 'Subcategory updated successfully', data: updated };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteSubCategory(param: IdParamDTO) {
    const subCategoryId = param.id;
    const checkSubCategory = await this.prisma.subCategory.findUnique({
      where: { id: subCategoryId },
    });

    if (!checkSubCategory) {
      throw new NotFoundException('subcategory not found');
    }

    const extractFilePath = (url: string): string => {
      const base = `${process.env.SUPABASE_URL}/storage/v1/object/public/nearme/`;
      return url.replace(base, '');
    };

    const fileName = extractFilePath(checkSubCategory.featuredImage);

    try {
      await this.imageService.deleteImage(fileName);
      await this.prisma.subCategory.delete({
        where: { id: subCategoryId },
      });

      return {
        message: 'subcategory deleted successfully',
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
    });
    return {
      data: [
        ...docItems.map((item) => ({ type: 'doc', data: item })),
        ...placeItems.map((item) => ({ type: 'place', data: item })),
      ],
    };
  }

  async searchCategories(keyword: string) {
    try {
      const allCategories = await this.prisma.category.findMany({
        where: {
          OR: [{ name: { contains: keyword, mode: 'insensitive' } }],
        },
      });

      return {
        message: 'categories fetched successfully',
        data: allCategories,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async searchSubCategories(keyword: string) {
    try {
      const allSubCategories = await this.prisma.subCategory.findMany({
        where: {
          OR: [{ name: { contains: keyword, mode: 'insensitive' } }],
        },
      });

      return {
        message: 'subcategories fetched successfully',
        data: allSubCategories,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
