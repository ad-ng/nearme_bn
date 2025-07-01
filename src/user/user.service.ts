/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CountryDTO, NamesDto } from './dtos';

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
}
