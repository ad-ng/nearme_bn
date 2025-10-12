/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddLocationDTO, IdParamDTO } from './dto';
import { ImagesService } from 'src/images/images.service';
import { LocationImage } from '@prisma/client';

@Injectable()
export class LocationService {
  constructor(
    private prisma: PrismaService,
    private imageService: ImagesService,
  ) {}

  async fetchLocationsInProvince(provinceName: string, query) {
    const page = parseInt(`${query.page}`, 10) || 1;
    const limit = parseInt(`${query.limit}`) || 10;

    const checkProvince = await this.prisma.provinces.findFirst({
      where: { name: provinceName },
    });
    if (!checkProvince) {
      return new NotFoundException(`no ${provinceName} Province found`);
    }

    try {
      const allLocations = await this.prisma.locations.findMany({
        where: { provinceId: checkProvince.id },
        include: { LocationImage: true },
        take: limit,
        skip: (page - 1) * limit,
      });
      return {
        message: 'Locations found successfully',
        data: allLocations,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async fetchDocItemsInProvince(provinceName: string, user, query) {
    const page = parseInt(`${query.page}`, 10) || 1;
    const limit = parseInt(`${query.limit}`) || 10;

    const userId = user.id;
    const checkProvince = await this.prisma.provinces.findFirst({
      where: { name: provinceName },
    });
    if (!checkProvince) {
      return new NotFoundException(`no ${provinceName} Province found`);
    }

    try {
      const allDocItems = await this.prisma.docItem.findMany({
        where: { provinceId: checkProvince.id },
        include: {
          author: true,
          savedItems: {
            where: { userId },
          },
        },
        take: limit,
        skip: (page - 1) * limit,
      });
      return {
        message: 'Doc Items found successfully',
        data: allDocItems,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async adminFetchAllLocations(query) {
    const page = parseInt(`${query.page}`, 10) || 1;
    const limit = parseInt(`${query.limit}`) || 10;

    try {
      const [allLocations, totalCount] = await Promise.all([
        this.prisma.locations.findMany({
          orderBy: [{ id: 'desc' }],
          include: { LocationImage: true },
          take: limit,
          skip: (page - 1) * limit,
        }),
        this.prisma.locations.count(),
      ]);

      return {
        message: 'Locations Are Fetched Successfully !',
        data: allLocations,
        total: totalCount,
        page,
        limit,
      };
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }

  async addingLocation(dto: AddLocationDTO, files: Express.Multer.File[]) {
    const { provinceName, address, description, latitude, longitude, title } =
      dto;

    const checkProvince = await this.prisma.provinces.findFirst({
      where: { name: provinceName },
    });
    if (!checkProvince) {
      throw new NotFoundException('invalid province');
    }

    // Upload images to Supabase storage
    const uploadedImages: string[] = [];

    for (const [index, file] of files.entries()) {
      const fileName = `location/${title.trim().split(' ').join('-')}-${Date.now()}-${index + 1}.jpg`;

      // upload to Supabase
      await this.imageService.uploadSingleImage(file, fileName);

      const imageUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/nearme/${fileName}`;
      uploadedImages.push(imageUrl);
    }

    // Create the main location record
    const newLocation = await this.prisma.locations.create({
      data: {
        address,
        description,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        title,
        provinceId: checkProvince.id,
      },
    });

    // Save image URLs in the LocationImage table
    const locationImagesData = uploadedImages.map((url) => ({
      url,
      locationId: newLocation.id,
    }));

    await this.prisma.locationImage.createMany({
      data: locationImagesData,
    });

    return {
      message: 'location added successfully',
      data: newLocation,
    };
  }

  async updateLocation(dto: AddLocationDTO, param: IdParamDTO) {
    const { provinceName, address, description, latitude, longitude, title } =
      dto;

    const locationId = param.id;
    const CheckLocation = await this.prisma.locations.findUnique({
      where: { id: locationId },
    });

    if (!CheckLocation) {
      throw new NotFoundException('invalid location');
    }

    const checkProvince = await this.prisma.provinces.findFirst({
      where: { name: provinceName },
    });
    if (!checkProvince) {
      throw new NotFoundException('invalid province');
    }

    try {
      const newLocation = await this.prisma.locations.update({
        where: { id: locationId },
        data: {
          address,
          description,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          title,
          provinceId: checkProvince.id,
        },
      });

      return {
        message: 'location edited successfully',
        data: newLocation,
      };
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }

  async deleteLocation(param: IdParamDTO) {
    const locationId = param.id;
    const CheckLocation = await this.prisma.locations.findUnique({
      where: { id: locationId },
    });

    if (!CheckLocation) {
      throw new NotFoundException('invalid location');
    }

    const allLocationImages: LocationImage[] =
      await this.prisma.locationImage.findMany({
        where: { locationId },
      });

    const allImagesFileNames: string[] = [];
    allLocationImages.map((locationImg) => {
      const extractFilePath = (url: string): string => {
        const base = `${process.env.SUPABASE_URL}/storage/v1/object/public/nearme/`;
        return url.replace(base, '');
      };

      const fileName: string = extractFilePath(locationImg.url);
      allImagesFileNames.push(fileName);
    });

    try {
      await this.imageService.deleteManyImage(allImagesFileNames);
      await this.prisma.locations.delete({
        where: { id: locationId },
      });

      return {
        message: 'location deleted successfully',
      };
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }

  async search(allQuery: any) {
    const { query } = allQuery;
    const page = parseInt(`${query.page}`, 10) || 1;
    const limit = parseInt(`${query.limit}`) || 10;

    try {
      const allLocations = await this.prisma.locations.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { address: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: limit,
        skip: (page - 1) * limit,
      });

      return {
        message: 'locations fetched successfully',
        data: allLocations,
        limit,
        page,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
