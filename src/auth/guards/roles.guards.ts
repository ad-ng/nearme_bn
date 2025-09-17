/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// /* eslint-disable @typescript-eslint/no-unsafe-member-access */
// /* eslint-disable @typescript-eslint/no-unsafe-argument */
// /* eslint-disable @typescript-eslint/no-unsafe-assignment */

// import {
//   CanActivate,
//   ExecutionContext,
//   Injectable,
//   ForbiddenException,
// } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { ROLES_KEY } from '../decorators/role.decorator';
// import { RoleStatus } from '@prisma/client';

// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}

//   canActivate(context: ExecutionContext): boolean {
//     const requiredRoles = this.reflector.getAllAndOverride<RoleStatus[]>(
//       ROLES_KEY,
//       [context.getHandler(), context.getClass()],
//     );
//     if (!requiredRoles) {
//       return true; // No roles required, allow access
//     }

//     const { user } = context.switchToHttp().getRequest();
//     if (!user || !requiredRoles.includes(user.role)) {
//       throw new ForbiddenException(
//         'You do not have permission to access this resource',
//       );
//     }

//     return true;
//   }
// }

// roles.guard.ts
// import {
//   CanActivate,
//   ExecutionContext,
//   ForbiddenException,
//   Injectable,
// } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { ROLES_KEY } from '../decorators/role.decorator';
// import { RoleStatus } from '@prisma/client';

// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}

//   canActivate(context: ExecutionContext): boolean {
//     const requiredRoles = this.reflector.getAllAndOverride<RoleStatus[]>(
//       ROLES_KEY,
//       [context.getHandler(), context.getClass()],
//     );

//     if (!requiredRoles) return true; // no role restriction

//     const request = context.switchToHttp().getRequest();
//     const user = request.user;

//     if (!user || !user.role) {
//       throw new ForbiddenException('User role not found');
//     }

//     // Check if the user's role is in the required roles
//     const hasRole = requiredRoles.includes(user.role);
//     if (!hasRole) {
//       throw new ForbiddenException(
//         'You do not have permission to access this resource',
//       );
//     }

//     return true;
//   }
// }

// auth/guards/roles.guard.ts
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/role.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { RoleStatus } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Skip if route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const requiredRoles = this.reflector.getAllAndOverride<RoleStatus[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) return true; // no roles required

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.role) {
      throw new ForbiddenException('User role not found');
    }

    const hasRole = requiredRoles.includes(user.role);
    if (!hasRole) throw new ForbiddenException('Access denied');

    return true;
  }
}
