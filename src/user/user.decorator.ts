import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';

export const CurrentUser = createParamDecorator(
  <K extends keyof User>(args: K | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as User;

    if (!user) {
      throw new UnauthorizedException('User not found in the request');
    }

    return args ? user[args] : user;
  },
);
