// import { AuthGuard } from '@nestjs/passport';
// import { ExecutionContext, Injectable } from '@nestjs/common';

// import { UnauthorizedException } from '../../../exceptions/unauthorized.exception';

// @Injectable()
// export class JwtUserAuthGuard extends AuthGuard('authUser') {
//   JSON_WEB_TOKEN_ERROR = 'JsonWebTokenError';

//   TOKEN_EXPIRED_ERROR = 'TokenExpiredError';

//   canActivate(context: ExecutionContext) {
//     // Add your custom authentication logic here
//     // for example, call super.logIn(request) to establish a session.
//     return super.canActivate(context);
//   }

//   handleRequest(err: any, user: any, info: Error, context: any, status: any) {
//     // You can throw an exception based on either "info" or "err" arguments
//     if (info?.name === this.JSON_WEB_TOKEN_ERROR) {
//       throw UnauthorizedException.JSON_WEB_TOKEN_ERROR();
//     } else if (info?.name === this.TOKEN_EXPIRED_ERROR) {
//       throw UnauthorizedException.TOKEN_EXPIRED_ERROR();
//     } else if (info) {
//       throw UnauthorizedException.UNAUTHORIZED_ACCESS(info.message);
//     } else if (err) {
//       throw err;
//     }

//     return super.handleRequest(err, user, info, context, status);
//   }
// }

import { CanActivate, ExecutionContext, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// eslint-disable-next-line import/no-extraneous-dependencies
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: `${process.env.JWT_SECRET}`,
      });

      if (!payload) {
        throw new HttpException('user not found', 404);
      }

      const { user } = payload;

      request.user = user;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
