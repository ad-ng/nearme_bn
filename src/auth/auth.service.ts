import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { loginDTO } from './dtos';
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
}
