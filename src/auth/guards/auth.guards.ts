/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// /* eslint-disable @typescript-eslint/no-unsafe-argument */
// /* eslint-disable @typescript-eslint/no-unsafe-member-access */
// /* eslint-disable @typescript-eslint/no-unsafe-call */
// /* eslint-disable @typescript-eslint/no-unsafe-assignment */
// import {
//   CanActivate,
//   ExecutionContext,
//   Injectable,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';

// @Injectable()
// export class AuthGuard implements CanActivate {
//   constructor(private jwtService: JwtService) {}

//   async canActivate(context: ExecutionContext) {
//     const request = context.switchToHttp().getRequest();
//     const authorization = request.headers.authorization;
//     const token = authorization?.split(' ')[1];

//     if (!token) {
//       throw new UnauthorizedException();
//     }

//     try {
//       const tokenPayLoad: object = await this.jwtService.verifyAsync(token);
//       request.user = tokenPayLoad;
//       return true;
//     } catch (error) {
//       console.error(error);
//       throw new UnauthorizedException();
//     }
//   }
// }

// import {
//   CanActivate,
//   ExecutionContext,
//   Injectable,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { AuthService } from '../auth.service';

// @Injectable()
// export class AuthGuard implements CanActivate {
//   constructor(
//     private jwtService: JwtService,
//     private authService: AuthService,
//   ) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest();
//     const authorization = request.headers.authorization;
//     const token = authorization?.split(' ')[1];

//     if (!token) {
//       throw new UnauthorizedException('Missing token');
//     }

//     try {
//       const tokenPayload: any = await this.jwtService.verifyAsync(token);

//       // ✅ Check user in DB
//       const user = await this.authService.fetchUserWithIdAndEmail(
//         tokenPayload.email,
//         tokenPayload.id,
//       );
//       if (!user) throw new UnauthorizedException('User no longer exists');
//       // if (user.isDeleted || user.isBlocked)
//       //   throw new UnauthorizedException('User inactive');

//       request.user = user; // attach real user
//       return true;
//     } catch (err) {
//       throw new UnauthorizedException('Invalid or expired token');
//     }
//   }
// }

// auth/guards/roles.guard.ts
// auth/guards/auth.guard.ts
// import {
//   CanActivate,
//   ExecutionContext,
//   Injectable,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { Reflector } from '@nestjs/core';
// import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

// @Injectable()
// export class AuthGuard implements CanActivate {
//   constructor(
//     private jwtService: JwtService,
//     private reflector: Reflector,
//   ) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     // 👇 Skip auth if route is marked as public
//     const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
//       context.getHandler(),
//       context.getClass(),
//     ]);
//     if (isPublic) return true;

//     const request = context.switchToHttp().getRequest();
//     const authorization = request.headers.authorization;
//     const token = authorization?.split(' ')[1];

//     if (!token) {
//       throw new UnauthorizedException('No token provided');
//     }

//     try {
//       const tokenPayload = await this.jwtService.verifyAsync(token);
//       request.user = tokenPayload;
//       return true;
//     } catch (error) {
//       throw new UnauthorizedException('Invalid or expired token');
//     }
//   }
// }

// auth/guards/auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Skip auth if route is marked @Public()
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) throw new UnauthorizedException('No token provided');

    try {
      const payload = await this.jwtService.verifyAsync(token);
      request.user = payload; // attach user info
      return true;
    } catch (err) {
      throw new UnauthorizedException(`Invalid or expired token: ${err}`);
    }
  }
}
