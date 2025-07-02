/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CountryDTO, NamesDto, TravelStatusDTO, UserInterestDTO } from './dtos';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getCurrentUser(user) {
    const { id } = user;

    const checkUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!checkUser) throw new UnauthorizedException('Login to continue');

    return {
      message: 'user found successfully',
      data: checkUser,
    };
  }

  async updateNames(dto: NamesDto, user) {
    const { id } = user;

    const checkUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!checkUser) throw new UnauthorizedException('Login to continue');

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: dto,
      });
      return {
        message: 'names updated successfully',
        data: updatedUser,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateCountry(dto: CountryDTO, user) {
    const { id } = user;

    const checkUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!checkUser) throw new UnauthorizedException('Login to continue');

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: dto,
      });
      return {
        message: 'country updated successfully',
        data: updatedUser,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateTravelStatus(dto: TravelStatusDTO, user) {
    const { id } = user;

    const checkUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!checkUser) throw new UnauthorizedException('Login to continue');

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: dto,
      });
      return {
        message: 'Travel Status updated successfully',
        data: updatedUser,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async saveUserInterest(dto: UserInterestDTO, user) {
    const { categoryId } = dto;

    const userId: number = user.id;

    const checkUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!checkUser) throw new UnauthorizedException('Login to continue');
    try {
      const savedInterest = await this.prisma.userInterests.upsert({
        where: {
          userId_categoryId: {
            userId: userId,
            categoryId: dto.categoryId,
          },
        },
        create: { categoryId, userId },
        update: { categoryId, userId },
      });
      return {
        message: 'category saved successfully',
        data: savedInterest,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
