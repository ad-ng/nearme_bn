import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { loginDTO, RegisterDTO } from './dtos';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
  ) {}

  async signin(dto: loginDTO) {
    const { email, password } = dto;

    const currentUser = await this.prisma.user.findUnique({ where: { email } });

    if (!currentUser) {
      throw new ForbiddenException('invalid credentials');
    }

    const checkPassword: boolean = await argon.verify(
      currentUser.password,
      password,
    );

    if (!checkPassword) {
      throw new ForbiddenException('invalid credentials');
    }

    return {
      token: await this.jwt.signAsync(currentUser),
      data: currentUser,
    };
  }

  async register(dto: RegisterDTO) {
    const { email, password, dob, firstName, lastName } = dto;

    const checkEmail = await this.prisma.user.findUnique({ where: { email } });

    if (checkEmail) throw new BadRequestException('email already exist');

    const hashedPassword: string = await argon.hash(password);

    try {
      const newUser = await this.prisma.user.create({
        data: {
          password: hashedPassword,
          email,
          firstName,
          dob,
          lastName,
        },
      });
      return {
        message: 'the user registered successfully',
        token: this.jwt.sign(newUser),
      };
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }
}
